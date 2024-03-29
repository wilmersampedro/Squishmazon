import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { thunkFetchProducts } from "../../redux/product";
import './Product.css'

function Products() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const sessionUser = useSelector((state) => state.session.user)
  const products = useSelector((state) => state.product)
  const prodArr = Object.values(products)
  useEffect(() => {
    dispatch(thunkFetchProducts())
  }, [dispatch])

  // if (!prodArr[prodArr.length - 1].product_images) return null

  return (
    <>
      <div>
      </div>
      {(() => {
        let productsToDisplay = Object.values(products)

        return productsToDisplay.length ? <div className="productGrid">
          {productsToDisplay.map(p => p.in_stock && <div
            className="productTile"
            key={p.id}
            onClick={() => {
              navigate(`/product/${p.id}`)
            }}
          >
            <div>
              <div className="tileImageContainer">
                <img src={p.product_images[0]?.url} alt="tileImage" className="tileImage" />
              </div>
              <div>{p.product_name}</div>
              {/* <div>In Stock!</div> */}
              <div className={p.avg_reviews == 5 || p.avg_reviews >= 4.8 ? "star-5" : p.avg_reviews < 4.8 && p.avg_reviews >= 4.3 ? "star-4-5" : p.avg_reviews < 4.3 && p.avg_reviews >= 3.8 ? "star-4" : p.avg_reviews < 3.8 && p.avg_reviews >= 3.3 ? "star-3-5" : p.avg_reviews < 3.3 && p.avg_reviews >= 2.8 ? "star-3" : p.avg_reviews < 2.8 && p.avg_reviews >= 2.3 ? "star-2-5" : p.avg_reviews < 2.3 && p.avg_reviews >= 1.8 ? "star-2" : p.avg_reviews < 1.8 && p.avg_reviews >= 1.3 ? "star-1-5" : p.avg_reviews < 1.3 && p.avg_reviews >= .8 ? "star-1" : p.avg_reviews < .8 && p.avg_reviews >= .3 ? "star-half" : "star-0"}><span className="numReviews">{p.num_reviews} {p.num_reviews == 1 ? "Review" : "Reviews"}</span> </div>
              <div className="tilePrice">${p.price.toFixed(2)}</div>

            </div>

          </div>)}
        </div> : <div>
          <h2>No Products yet!</h2>
        </div>
      })()}
    </>
  );
}


export default Products;
