import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { thunkDeleteWishlistItem, thunkFetchMyWishlist } from "../../redux/wishlist";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import { useModal } from "../../context/Modal";
import './Wishlist.css'
import DeleteWishlistItemModal from "../DeleteWishlistItemModal/DeleteWishlistItemModal";


function Wishlist() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { closeModal } = useModal()
  const wishlist = useSelector((state) => state.wishlist)
  const wishlistArr = Object.values(wishlist)

  useEffect(() => {
    dispatch(thunkFetchMyWishlist())
  }, [dispatch])

  // if (!wishlistArr[0].product_images) return null;
  if(wishlist.wishlist) return null;

  return (
    <>
      <div id="wishlistOuterContainer">Wish List
        {(() => {
          let wishlistItems = Object.values(wishlist)

          return wishlistItems.length ? <div className="wishlistContainer">
            {wishlistItems?.map(w =>
                <div >
                  <div className="wishlistRow">
                    <div className="wishlistImageContainer">
                    <img src={w?.product_images[0]?.url} alt="Product Image" className="wishlistImage" />
                    </div>
                    <div className="wishlistItemRight">
                    <div>
                      {w?.product_name}
                    <div>Item added {w?.created_at}</div>
                    </div>
                    <div>
                     Price: ${w?.price}
                    </div>
                    <div>{w?.in_stock ? "In Stock!" : "Out of stock"}</div>
                    <div>
                      <OpenModalMenuItem
                        className="deleteBtn"
                        itemText="Remove from Wish List"
                        iconClassName="fa-regular fa-trash-can"
                        modalComponent={<DeleteWishlistItemModal wishlist={w}/>}
                      />
                      {/* <i className="fa-regular fa-trash-can" ></i> */}
                    </div>
                    </div>
                  </div>
                </div>
            )}
          </div> : <div>
            <h2>No Items in your Wish List</h2>
          </div>
        })()}
      </div>
    </>
  )
}

export default Wishlist;
