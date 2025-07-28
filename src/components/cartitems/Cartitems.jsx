import React, { useContext } from "react";
import "./Cartitems.css";
import { Shopcontext } from "../../context/Shopcontext";
import remove_icon from "../assets/cart_cross_icon.png";

const Cartitems = () => {
  const { all_product, cartItems, removeFromCart, getTotalCartAmount } =
    useContext(Shopcontext);
  return (
    <div className="cartitems">
      {/* Header Row */}
      <div className="cartitems-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Price</p>
        <p>Quantity</p>
        <p>Total</p>
        <p>Remove</p>
      </div>
      <hr />

      {/* Cart Items */}
      {all_product
        .filter((e) => cartItems[e.id] > 0)
        .map((e) => (
          <div key={e.id}>
            <div className="cartitems-format">
              <img src={e.image} alt="" className="carticon-product-icon" />
              <p>{e.name}</p>
              <p>${e.new_price}</p>
              <button className="cartitems-quantity">{cartItems[e.id]}</button>
              <p>${(cartItems[e.id] * e.new_price).toFixed(2)}</p>
              <img
                className="cartitems-remove-icon"
                src={remove_icon}
                onClick={() => removeFromCart(e.id)}
                alt=""
              />
            </div>
            <hr />
          </div>
        ))}
      <div className="cartitems-down">
        <div className="cartitems-total">
          <h1>cart Totals</h1>
          <div>
            <div className="cartitems-total-item">
              <p>SubTotal</p>
              <p>${getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cartitems-total-item">
              <p>Shipping Fee</p>
              <p>Free</p>
            </div>
            <hr />
            <div className="cartitems-total-item">
              <h3>Total</h3>
              <h3>${getTotalCartAmount()}</h3>
            </div>
          </div>
          <button>PROCEED TO CHECKOUT</button>
        </div>
        <div className="cartitems-promocode">
          <p>If you have a promo code, Enter it here:</p>
          <div className="cartitems-promobox">
            <input type="text" placeholder="Promo Code" />
            <button>Submit</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cartitems;
