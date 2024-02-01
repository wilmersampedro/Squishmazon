import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { thunkDeleteReview } from "../../redux/review";
import './DeleteReviewModal.css'

function DeleteReviewModal({ review }) {
  const dispatch = useDispatch()
  const {closeModal} = useModal()

  const handleDeleteRev = e => {
    e.preventDefault()
    closeModal()
    dispatch(thunkDeleteReview(review?.id))
  }
  return (
    <>
    <div>
      Delete Review
    </div>
    <form onSubmit={handleDeleteRev}>
      <div>Are you sure you want to delete this review?</div>
      <div>
          <div onClick={closeModal}>Cancel</div>
          <button type="submit" onClick={handleDeleteRev}>Yes (delete review)</button>
        </div>
    </form>
    </>
  )
}

export default DeleteReviewModal;
