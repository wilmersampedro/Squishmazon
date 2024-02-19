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
  const [price, setPrice] = useState(null);
  const [image, setImage] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [file, setFile] = useState("")
  const [fileName, setFilename] = useState("")
  const [imageURL, setImageURL] = useState("")
  const [optional, setOptional] = useState("")


  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {}
    if (productName.length > 128) errs.productName = "Name must be less than 128 characters"
    if (description.length > 350) errs.description = "Description must be less than 350 characters"
    if (!productName) errs.productName = "Please include a name for your 'mallow"
    if (!description) errs.description = "Please include a description for your 'mallow"
    if (!price) errs.price = "Please set a price for your 'mallow"
    if (!image) {
      errs.image = "Please upload an image to create a new 'mallow"
      // setErrors(errs)
      // return errors
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
    if (newProduct.errors) {
      console.log("RESPONSE IN COMPONENT: ", newProduct)
      setErrors({ ...newProduct.errors, ...errors })
      console.log("🚀 ~ handleSubmit ~ errors:", errors)
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

  const fileWrap = (e) => {
    e.stopPropagation();

    const tempFile = e.target.files[0];

    // Check for max image size of 5Mb
    if (tempFile.size > 5000000) {
      setFilename(maxFileError); // "Selected image exceeds the maximum file size of 5Mb"
      return
    }

    const newImageURL = URL.createObjectURL(tempFile); // Generate a local URL to render the image file inside of the <img> tag.
    setImageURL(newImageURL);
    setFile(tempFile);
    setFilename(tempFile.name);
    setOptional("");
  }

  return (
    <>
      <div id="editModalTitle">Create your 'mallow</div>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div id="uploadImgContainer">
          Upload an image of your 'mallow
          <input
            id="fileUpload"
            type="file"
            accept="image/*"
            onChange={(e) => {
              fileWrap(e);
              setImage(e.target.files[0])
            }}
          />
          <label htmlFor="fileUpload" className="imgUpload">
            Choose File
          </label>
          <span className="form-errors">{errors.image}</span>
          <div id="thumbnailContainer">
            {imageURL && <img src={imageURL} alt="thumbnail" id="thumbnailImg" />}
            {!imageURL && <div id="noThumbnail">No file chosen</div>}
            {/* <span id="fileName">{file.name ? file.name : "No file chosen"}</span> */}
            {/* <div className="form-errors">
            {errors.image}
          </div> */}
          </div>
        </div>
        <div id="nameInputContainer">
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
          <div className={productName.length > 128 ? "overCharLimit" : "charLimitDiv"} >{productName.length}/128</div>

          <div className="form-errors">
            {errors.productName}{errors.product_name}
          </div>
        </div>
        <div id="descInputContainer">
          <label htmlFor="desc">
            Description
          </label>
          <textarea
            name="desc"
            value={description}
            placeholder="Describe your 'mallow"
            rows="7"
            cols="50"
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className={description.length > 350 ? "overCharLimit" : "charLimitDiv"} >{description.length}/350</div>
          <div className="form-errors">
            {errors.description}
          </div>
        </div>
        <div id="priceInputContainer">
          <label htmlFor="price">
            Price
          </label>
          <span id="dollarSpan">$</span>
          <input
            type="number"
            name="price"
            min="0"
            placeholder="Enter value in USD"
            value={price}
            step=".01"
            onChange={(e) => setPrice(e.target.value)}
          />
          <div className="form-errors">
            {errors.price}
          </div>
        </div>
        <br />
        <div id="submitModalBtns">
          <div id="cancelBtn" onClick={closeModal}>Cancel</div>
          <button type="submit">Submit</button>
          {(imageLoading && !Object.keys(errors).length) && <p>Loading...</p>}
        </div>
      </form>
    </>
  )
}

export default CreateProductModal;
