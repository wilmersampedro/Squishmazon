import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { thunkDeleteWishlistItem } from "../../redux/wishlist";
import './DeleteWishlistItemModal.css'


function DeleteWishlistItemModal({ wishlist }) {
  const dispatch = useDispatch()
  const { closeModal } = useModal()
  const handleDeleteWishListItem = (e) => {
    e.preventDefault();
    closeModal();
    dispatch(thunkDeleteWishlistItem(wishlist.id))
  }

  return (
    <>
      <div id="modalTitle">Remove item from Wish List?</div>
      <form onSubmit={handleDeleteWishListItem}>
        <br/>
        <div id="modalFooter">
          <div className="btnTxt" onClick={closeModal}>Cancel</div>
          <input type="submit" className="btnRed" value="Remove from Wish List"/>
        </div>
      </form>
    </>
  )
}

export default DeleteWishlistItemModal;
