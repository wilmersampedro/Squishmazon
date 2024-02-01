import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useParams } from 'react-router-dom';
import { thunkFetchOneProduct } from "../../redux/product";
import { thunkFetchReviews } from "../../redux/review";
import './ProductDetail.css'

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
  },[dispatch])

  if (!product) return null

  return (
    <>
      <div>
        <div>{product?.product_name}</div>
        <div>{product?.price}</div>
        <div>{product?.description}</div>
        <div>{product?.in_stock ? 'In Stock!' : 'Out of Stock'}</div>

      </div>
      <br/>
      <div>
        {(() => {
          let reviewsToDisplay = Object.values(reviews)

          return reviewsToDisplay.length ?
          <div> Reviews:
            {reviewsToDisplay.map(r => <div
            key={r.id}
            >
              {r?.user_id == user?.id && <div>test</div> }
              <div>{r?.author["first_name"]} {r?.author["last_name"]}</div>
              <div>{r?.stars} stars</div>
              <div>Reviewed on: {r?.created_at}</div>
              <div>{r?.review_text}</div>
            </div>)}
          </div> :
          <div>
            <h2>Be the first to post a review!</h2>
          </div>
        })()}
      </div>
    </>
  )
}

export default ProductDetail;
