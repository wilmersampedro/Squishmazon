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
    <div id="deleteModalTitle">
      Delete Product
    </div>
    <form onSubmit={handleDeleteProd}>
      <div id="confirmDeleteMsg">Are you sure you want to delete {product.product_name}?</div>
      <div id="submitModalBtns">
          <div id="cancelBtn" onClick={closeModal}>Cancel</div>
          <button type="submit">Yes (delete 'mallow)</button>
        </div>
    </form>
    </>
  )
}

export default DeleteProductModal;
