import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useParams } from 'react-router-dom';
import { thunkFetchOneProduct } from "../../redux/product";
import { thunkFetchReviews } from "../../redux/review";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import EditReviewModal from "../EditReviewModals";
import './ProductDetail.css'
import CreateReviewModal from "../CreateReviewModal/CreateReviewModal";
import DeleteReviewModal from "../DeleteReviewModal/DeleteReviewModal";
import BuyNowModal from "../BuyNowModal/BuyNowModal";

function ProductDetail() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { productId } = useParams()
  const product = useSelector((state) => state.product[productId])
  const reviews = useSelector((state) => state.review)
  const user = useSelector((state) => state.session.user)
  const [favProd, setFavProd] = useState(false)
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const toggleMenu = (e) => {
    e.stopPropagation(); // Keep from bubbling up to document and triggering closeMenu
    setShowMenu(!showMenu);
  };

  const closeMenu = () => setShowMenu(false);

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (ulRef.current && !ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const sortedArr = Object.values(reviews).sort((rev1, rev2) => {
    const date1 = new Date(rev1.createdAt);
    const date2 = new Date(rev2.createdAt);
    if (date1 < date2) {
      return 1
    } else if (date1 > date2) {
      return -1
    } else {
      return 0
    }
  })

  useEffect(() => {
    dispatch(thunkFetchReviews(productId))
  }, [dispatch, productId])

  useEffect(() => {
    dispatch(thunkFetchOneProduct(productId))
  }, [dispatch, reviews, productId])


  const existingReviewCheck = (userId) => {
    for (let review of Object.values(reviews)) {
      if (review.user_id == userId) return true;
    }
    return false;
  }

  const handleFav = (product) => {

  }


  if (!product || reviews.review || !product.product_images[0]?.url) return null
  return (
    <>
      <div id="productDetailContainer">
        <div>
          <img src={product?.product_images[0]?.url} alt="" />
        </div>
        <div id="productDetailsInner">
          <div id="productDetailsName">{product?.product_name} <i class="fa-solid fa-bookmark fav"></i></div>
          <div id="topAvgRevs">
            {product.avg_reviews}
            <div className={product.avg_reviews == 5 || product.avg_reviews >= 4.8 ? "star-5" : product.avg_reviews < 4.8 && product.avg_reviews >= 4.3 ? "star-4-5" : product.avg_reviews < 4.3 && product.avg_reviews >= 3.8 ? "star-4" : product.avg_reviews < 3.8 && product.avg_reviews >= 3.3 ? "star-3-5" : product.avg_reviews < 3.3 && product.avg_reviews >= 2.8 ? "star-3" : product.avg_reviews < 2.8 && product.avg_reviews >= 2.3 ? "star-2-5" : product.avg_reviews < 2.3 && product.avg_reviews >= 1.8 ? "star-2" : product.avg_reviews < 1.8 && product.avg_reviews >= 1.3 ? "star-1-5" : product.avg_reviews < 1.3 && product.avg_reviews >= .8 ? "star-1" : product.avg_reviews < .8 && product.avg_reviews >= .3 ? "star-half" : "star-0"}><span className="numReviews">{product.num_reviews} {product.num_reviews == 1 ? "Review" : "Reviews"}</span> </div>
          </div>
          <div id="productDetailsPrice"><span id="productDetailPriceSpan">Price:</span> ${product?.price.toFixed(2)}</div>
          <div id="productDetailsInStock">{product?.in_stock && <i class="fa-solid fa-check" onClick={handleFav} style={{ "color": "#33A3FF" }}></i>} {product?.in_stock ? 'In Stock!' : 'Out of Stock'}</div>
          <div id="productDetailsDescription">{product?.description}</div>
        </div>
        <div id="productCheckoutContainer">
          <div id="productDetailsPrice"><span id="productDetailPriceSpan"></span> ${product?.price.toFixed(2)}(${product?.price.toFixed(2)}/ Count)</div>
          <div>
            <i class="fa-solid fa-check" style={{ "color": "#33A3FF" }}></i><span style={{ "color": "#1BA1FF", "fontWeight": "bold" }}>prime</span> One-Day
          </div>
          <div className="returnDiv" onClick={toggleMenu}>
            FREE returns <i class="fa-solid fa-caret-down"></i>
            {showMenu && (
              <div className="return-dropdown" ref={ulRef}>
                <div>Return this item for free</div>
                <div>Free returns are available for the shipping address you chose. You can return the item for any reason in new and unused condition: no shipping charges</div>
              </div>
            )}
          </div>
          <div className="deliveryAnnouncement">FREE delivery <span style={{ "fontWeight": "bold" }}>Tomorrow.</span> Order Now!</div>
          <div className="deliveringMessage">
            <i class="fa-solid fa-location-dot"></i> {user ? `Deliver to ${user?.first_name}` : "Delivering to your city!"}
          </div>
          <div className="checkoutInStock">
            {product?.in_stock ? 'In Stock' : 'Out of Stock'}
          </div>
          <div className="quantitySelect">
            {/* <span>Quantity: </span> */}
            <label for="quantity">Quantity: </label>
              <select id="quantityMenu" name="quantity" class="product-select" tabindex="1">
                <option class="list" value="1" >1</option>
                <option class="list" value="2" >2</option>
                <option class="list" value="3" >3</option>
                <option class="list" value="4" >4</option>
                <option class="list" value="5" >5</option>
                <option class="list" value="6" >6</option>
                <option class="list" value="7" >7</option>
                <option class="list" value="8" >8</option>
                <option class="list" value="9" >9</option>
                <option class="list" value="10" >10</option>
              </select>
          </div>
          <div className="productCheckoutBtnsContainer">
              <div className="addToCartBtn">Add to Cart</div>
              <OpenModalButton
              id="buyNowBtn"
              buttonText="Buy Now"
              modalComponent={<BuyNowModal product={product}/>}
              />
          </div>
          <div className="productCheckoutBottom">
              <div className="productCheckoutBottomLeft">
                <p>Ships From</p>
                <p>Sold by</p>
                <p>Returns</p>
                <p>Payment</p>
                <p>Customer Service</p>
              </div>
              <div className="productCheckoutBottomRight">
                <p>Squishmazon</p>
                <p>{product?.owner?.first_name}</p>
                <p>Eligible for Return, Refund, or Replacement...</p>
                <p>Secure Payment</p>
                <p>Squishmazon</p>
              </div>
          </div>
        </div>
      </div>
      {/* <br /> */}
      <section id="reviewsSection">
        <div id="reviewSectionLeft">
          <div id="reviewSectionLeftHeader">Customer reviews</div>
          <div id="reviewSectionStars">
            <div className={product.avg_reviews == 5 || product.avg_reviews >= 4.8 ? "star-5" : product.avg_reviews < 4.8 && product.avg_reviews >= 4.3 ? "star-4-5" : product.avg_reviews < 4.3 && product.avg_reviews >= 3.8 ? "star-4" : product.avg_reviews < 3.8 && product.avg_reviews >= 3.3 ? "star-3-5" : product.avg_reviews < 3.3 && product.avg_reviews >= 2.8 ? "star-3" : product.avg_reviews < 2.8 && product.avg_reviews >= 2.3 ? "star-2-5" : product.avg_reviews < 2.3 && product.avg_reviews >= 1.8 ? "star-2" : product.avg_reviews < 1.8 && product.avg_reviews >= 1.3 ? "star-1-5" : product.avg_reviews < 1.3 && product.avg_reviews >= .8 ? "star-1" : product.avg_reviews < .8 && product.avg_reviews >= .3 ? "star-half" : "star-0"}><span className="revSecAvg">{product.avg_reviews} out of 5</span> </div>
          </div>
          <div id="globalRatings">{product?.num_reviews} global {product?.num_reviews == 1 ? "rating" : "ratings"}</div>
          <br />
          <div>
            {(user && product?.vendor_id !== user.id && existingReviewCheck(user.id) === false) &&
              <>
                <div id="revPromptLeft">Review this product</div>
                <div id="revPromptL2">Share your thoughts with other customers</div>
                <OpenModalButton
                  id="postRevBtn"
                  buttonText="Write a customer review"
                  modalComponent={<CreateReviewModal product={product} />}
                />
              </>}
          </div>
        </div>
        <div >
          {(() => {
            let reviewsToDisplay = Object.values(sortedArr)

            return reviewsToDisplay.length ?
              <div id="productReviewsSection"><span id="customersSay">Customers say</span>
                {reviewsToDisplay.map(r =>
                  <div
                    key={r.id}
                  >
                    <br />
                    <div>{r?.author["first_name"]} {r?.author["last_name"]}</div>
                    <div className={r.stars == 5 ? "star-5" : r.stars == 4 ? "star-4" : r.stars == 3 ? "star-3" : r.stars == 2 ? "star-2" : r.stars == 1 ? "star-1" : "star-0"}></div>

                    <div>Reviewed on: {dateFormatter(r?.created_at)}</div>
                    <div id="reviewText">{r?.review_text}</div>
                    <div id="revBtnContainer">
                      {r?.user_id == user?.id && <OpenModalButton
                        id="editRevBtn"
                        buttonText="Edit"
                        modalComponent={<EditReviewModal review={r} />}
                        onClick={(e) => {
                          e.stopPropagation()
                        }}

                      />}
                      {r?.user_id == user?.id && <OpenModalButton
                        id="deleteRevBtn"
                        buttonText="Delete"
                        modalComponent={<DeleteReviewModal review={r} />}
                      />}
                    </div>
                  </div>)}
              </div> :
              <div>
                {user?.id == product?.vendor_id ? <h2>No reviews yet!</h2> : <h2>Be the first to post a review!</h2>}
              </div>
          })()}
        </div>
      </section>
    </>
  )
}

const months = {
  Jan: "January",
  Feb: "February",
  Mar: "March",
  Apr: "April",
  May: "May",
  Jun: "June",
  Jul: "July",
  Aug: "August",
  Sep: "September",
  Oct: "October",
  Nov: "November",
  Dec: "December"
}
const dateFormatter = (date) => {
  const splitDate = date.split(" ")
  let day;
  if (splitDate[1][0] == 0) {
    day = splitDate[1][1]
  } else {
    day = splitDate[1]
  }
  const month = splitDate[2]
  return `${months[month]}, ${day} ${splitDate[3]}`
}

export default ProductDetail;
