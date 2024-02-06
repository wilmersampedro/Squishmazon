import { useEffect } from "react";
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

function ProductDetail() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { productId } = useParams()
  const product = useSelector((state) => state.product[productId])
  const reviews = useSelector((state) => state.review)
  const user = useSelector((state) => state.session.user)

  useEffect(() => {
    dispatch(thunkFetchReviews(productId))
  }, [dispatch, productId])

  useEffect(() => {
    dispatch(thunkFetchOneProduct(productId))
  }, [dispatch, productId])


  const existingReviewCheck = (userId) => {
    for (let review of Object.values(reviews)) {
      if (review.user_id == userId) return true;
    }
    return false;
  }

  if (!product || reviews.review || !product.product_images[0]?.url) return null
  return (
    <>
      <div id="productDetailContainer">
        <div>
          <img src={product?.product_images[0]?.url} alt="" />
        </div>
        <div id="productDetailsInner">
          <div id="productDetailsName">{product?.product_name}</div>
          <div className={product.avg_reviews == 5 ? "star-5" : product.avg_reviews == 4 ? "star-4" : product.avg_reviews == 3 ? "star-3" : product.avg_reviews == 2 ? "star-2" : product.avg_reviews == 1 ? "star-1" : "star-0"}><span className="numReviews">{product.num_reviews} {product.num_reviews == 1 ? "Review" : "Reviews"}</span> </div>
          <div id="productDetailsPrice"><span id="productDetailPriceSpan">Price:</span> ${product?.price}</div>
          <div id="productDetailsInStock">{product?.in_stock && <i class="fa-solid fa-check" style={{ "color": "#33A3FF" }}></i>} {product?.in_stock ? 'In Stock!' : 'Out of Stock'}</div>
          <div id="productDetailsDescription">{product?.description}</div>
        </div>

      </div>
      <br />
      <section id="reviewsSection">
        <div id="reviewSectionLeft">
          <div id="reviewSectionStars">
            <div className={product.avg_reviews == 5 ? "star-5 revSec5" : product.avg_reviews == 4 ? "star-4 revSec4" : product.avg_reviews == 3 ? "star-3 revSec3" : product.avg_reviews == 2 ? "star-2 revSec2" : product.avg_reviews == 1 ? "star-1 revSec1" : "star-0 revSec0"}><span className="revSecAvg">{product.avg_reviews} out of 5</span> </div>
          </div>
          <div>
            {(user && product?.vendor_id !== user.id && existingReviewCheck(user.id) === false) && <OpenModalButton
              buttonText="Post Your Review"
              modalComponent={<CreateReviewModal product={product} />}
            />}
          </div>
        </div>
        <div >
          {(() => {
            let reviewsToDisplay = Object.values(reviews)

            return reviewsToDisplay.length ?
              <div id="productReviewsSection"><span id="customersSay">Customers say</span>
                {reviewsToDisplay.map(r => <div
                  key={r.id}
                >

                  <div>{r?.author["first_name"]} {r?.author["last_name"]}</div>
                  <div>{r?.stars} stars</div>
                  <div>Reviewed on: {r?.created_at}</div>
                  <div>{r?.review_text}</div>
                  {r?.user_id == user?.id && <OpenModalButton
                    buttonText="Edit"
                    modalComponent={<EditReviewModal review={r} />}
                    onClick={(e) => {
                      e.stopPropagation()
                    }}

                  />}
                  {r?.user_id == user?.id && <OpenModalButton
                    buttonText="Delete"
                    modalComponent={<DeleteReviewModal review={r} />}
                  />}
                </div>)}
              </div> :
              <div>
                <h2>Be the first to post a review!</h2>
              </div>
          })()}
        </div>
      </section>
    </>
  )
}

export default ProductDetail;
