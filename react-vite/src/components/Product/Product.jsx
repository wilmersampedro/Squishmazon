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

  if(!prodArr[prodArr.length - 1].product_images) return null

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
              <img src={p.product_images[0].url} alt="tileImage" className="tileImage"/>
            </div>
            <div>{p.price}</div>
            <div>{p.product_name}</div>
            <div>In Stock!</div>
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
