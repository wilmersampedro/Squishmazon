import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { thunkCreateProduct } from "../../redux/product";
import './CreateProductModal.css'

function CreateProductModal() {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [errors, setErrors] = useState({});


  const handleSubmit = e => {
    e.preventDefault()
    const errs = {}
    if(productName > 128) errs.productName = "Name must be less than 128 character"
    if(description > 350) errs.description = "Description must be less than 350 character"
    if (Object.keys(errs).length) return setErrors(errs)

    const body = {
      product_name: productName,
      description,
      price,
    }

    dispatch(thunkCreateProduct(body));
    closeModal()
  }

  return (
    <>
    <div id="createModalTitle">Create your 'mallow</div>
      <form onSubmit={handleSubmit} >
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
          <input type="submit"/>
        </div>
      </form>
    </>
  )
}

export default CreateProductModal;
