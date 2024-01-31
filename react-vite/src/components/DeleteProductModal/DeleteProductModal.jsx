import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { thunkDeleteProduct } from "../../redux/product";
import './DeleteProductModal.css'

function DeleteProductModal({ product }) {
  const dispatch = useDispatch()
  const {closeModal} = useModal()
  const handleDeleteProd = e => {
    e.preventDefault()
    closeModal()
    dispatch(thunkDeleteProduct(product?.id))
  }
  return (
    <>
    <div>
      Delete Product
    </div>
    <form onSubmit={handleDeleteProd}>
      <div>Are you sure you want to delete {product.product_name}?</div>
      <div>
          <div onClick={closeModal}>Cancel</div>
          <input type="submit"/>
        </div>
    </form>
    </>
  )
}

export default DeleteProductModal;
