import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { thunkFetchMyProducts } from "../../redux/product";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import './MyProducts.css'
import EditProductModal from "../EditProductModal";
import DeleteProductModal from "../DeleteProductModal/DeleteProductModal";


function MyProducts() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const sessionUser = useSelector((state) => state.session.user)
  const products = useSelector((state) => state.product)

  useEffect(() => {
    dispatch(thunkFetchMyProducts())
  }, [dispatch])

  return (
    <>
      <div>

      </div>
      {(() => {
        let productsToDisplay = Object.values(products)

        return productsToDisplay.length ? <div className="productGrid">
          {productsToDisplay.map(p =>
            <div>
              <div
                className="productTile"
                key={p.id}
                onClick={() => {
                  navigate(`/product/${p.id}`)
                }}
              >
                <div>{p.price}</div>
                <div>{p.product_name}</div>
                {p.in_stock ? <div>In Stock!</div> : <div>Out of Stock!</div>}
              </div>
              <div>
                <OpenModalButton
                  buttonText="Edit"
                  modalComponent={<EditProductModal product={p} />}
                  onClick={(e) => {
                    e.stopPropagation()
                  }}

                />
                <OpenModalButton
                  buttonText="Delete"
                  modalComponent={<DeleteProductModal product={p} />}
                />
              </div>
            </div>
          )}
        </div> : <div>
          <h2>No Products yet!</h2>
        </div>
      })()}
    </>
  );
}

export default MyProducts;
