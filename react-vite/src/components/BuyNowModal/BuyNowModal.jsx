import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import './BuyNowModal.css'
import { useNavigate } from "react-router-dom";

function BuyNowModal({ product }) {
  console.log("🚀 ~ BuyNowModal ~ product:", product)

  return (
    <>
      <div className="buyNowModalContainer">
        <div className="modalTopRow">
          Buy Now: {product?.product_name}
          <div>
          <i class="fa-solid fa-x"></i>
          </div>
        </div>
      </div>
    </>
  )
}

export default BuyNowModal;
