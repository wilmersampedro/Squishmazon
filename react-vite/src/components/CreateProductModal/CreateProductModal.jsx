import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { thunkCreateImage, thunkCreateProduct, thunkFetchOneProduct } from "../../redux/product";
import './CreateProductModal.css'
import { useNavigate } from "react-router-dom";

function CreateProductModal() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { closeModal } = useModal();
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [errors, setErrors] = useState({});


  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {}
    if(productName > 128) errs.productName = "Name must be less than 128 character"
    if(description > 350) errs.description = "Description must be less than 350 character"

    if(!image) {
      errs.image = "At least one image is required to create new `mallow"
      setErrors(errs)
      return errors
    }

    if (Object.keys(errs).length) {
      setErrors(errs)
      return errors
    }


    const body = {
      product_name: productName,
      description,
      price,
    }

    const newProduct = await dispatch(thunkCreateProduct(body));
    if(newProduct.errors) {
      setErrors({...newProduct.errors, ...errors})
      return errors
    } else {


      // closeModal()


      const formData = new FormData();
      formData.append("image", image);
      console.log("*** IN COMPONENT: ", formData)
      // aws uploads can be a bit slow-displaying
      // some sort of loading message is a good idea
      setImageLoading(true);
      const newImg = await dispatch(thunkCreateImage(newProduct, formData));
      console.log("new image response? : ", newImg)
      // history.push("/images");
      closeModal()
      dispatch(thunkFetchOneProduct(newProduct.id)) //this makes it so that the page doesn't break when making new prod?
      navigate(`/product/${newProduct.id}`)
    }
  }

  return (
    <>
    {Object.values(errors).length ? Object.values(errors).map((e) => <div>{e}</div>) : <div>no errors</div>}
    <div id="createModalTitle">Create your 'mallow</div>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div>
        <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
            />
        </div>
        <div>
          <label htmlFor="productName">
            Name
          </label>
          <input
            type="text"
            name="productName"
            value={productName}
            placeholder="What's your `malllow's name?"
            onChange={(e) => setProductName(e.target.value)}
          />
        </div>
        <div>
        <label htmlFor="desc">
          Description
        </label>
        <textarea
        name="desc"
        value={description}
        placeholder="Describe your 'mallow"
        rows="10"
        cols="30"
        onChange={(e) => setDescription(e.target.value)}
        />
        </div>
        <div>
        <label htmlFor="price">
          Price
        </label>
        <input
        type="number"
        name="price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        />
        </div>
        <div>
          <div onClick={closeModal}>Cancel</div>
          <button type="submit">Submit</button>
          {(imageLoading)&& <p>Loading...</p>}
        </div>
      </form>
    </>
  )
}

export default CreateProductModal;
