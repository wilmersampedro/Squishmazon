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

  useEffect(() => {
    dispatch(thunkFetchProducts())
  }, [dispatch])

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
            <div>{p.price}</div>
            <div>{p.product_name}</div>
            <div>In Stock!</div>

          </div>)}
        </div> : <div>
          <h2>No Products yet!</h2>
        </div>
      })()}
    </>
  );
}


export default Products;
