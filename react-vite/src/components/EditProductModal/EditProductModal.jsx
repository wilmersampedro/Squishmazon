import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { thunkEditProduct } from "../../redux/product";
import "./EditProductModal.css";

function EditProductModal({ product }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal()
  const [productName, setProductName] = useState(product.product_name)
  const [description, setDescription] = useState(product.description)
  const [price, setPrice] = useState(product.price)
  const [inStock, setInStock] = useState(product.in_stock)
  const [errors, setErrors] = useState({})


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
      in_stock: inStock
    }

    dispatch(thunkEditProduct(product.id, body, ok => {
      if(ok) return closeModal()
      setErrors(errors)
    }))
  }

  return (
    <>
      <div id="editModalTitle">Edit your 'mallow</div>
      <form onSubmit={handleSubmit} >
        <div>
          <label htmlFor="productName">
            Name
          </label>
          <input
            type="text"
            name="productName"
            value={productName}
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
        <label htmlFor="inStock">
          in_stock
        </label>
        <input
        type="checkbox"
        checked={inStock}
        onClick={(e) => setInStock(!inStock)}
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

export default EditProductModal;
