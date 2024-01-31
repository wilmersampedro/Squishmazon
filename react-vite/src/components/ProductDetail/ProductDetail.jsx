import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useParams } from 'react-router-dom';
import { thunkFetchOneProduct } from "../../redux/product";
import './ProductDetail.css'

function ProductDetail() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { productId } = useParams()
  const product = useSelector((state) => state.product[productId])
  console.log(product)

  return (
    <>
      <div>
        <div>{product.product_name}</div>
        <div>{product.price}</div>
        <div>{product.description}</div>
        <div>{product.in_stock ? 'In Stock!' : 'Out of Stock'}</div>

      </div>
    </>
  )
}

export default ProductDetail;
