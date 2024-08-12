import React, { useContext, useEffect } from "react";
import { CartContext } from "../Global/CartContext";
import { Navbar } from "./Navbar";
import { Icon } from "react-icons-kit";
import { ic_add } from "react-icons-kit/md/ic_add";
import { ic_remove } from "react-icons-kit/md/ic_remove";
import { iosTrashOutline } from "react-icons-kit/ionicons/iosTrashOutline";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../Config/Config";

export const Cart = ({ user }) => {
  const { shoppingCart, dispatch, totalPrice, totalQty } =
    useContext(CartContext);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        // Kullanıcı giriş yapmamışsa login sayfasına yönlendirin
        navigate("/login");
      }
    });

    // Temizlik işlevi
    return () => unsubscribe();
  }, [navigate]);

  if (!user) {
    // Eğer kullanıcı oturum açmamışsa hiçbir şey render etmeyin
    return null;
  }

  const handleIncrement = (cart) => {
    dispatch({ type: "INC", id: cart.ProductID, cart });
  };

  const handleDecrement = (cart) => {
    dispatch({ type: "DEC", id: cart.ProductID, cart });
  };

  const handleDelete = (cart) => {
    dispatch({ type: "DELETE", id: cart.ProductID, cart });
  };

  return (
    <>
      <Navbar user={user} />
      <div className="cart-container">
        {shoppingCart.length === 0 ? (
          <>
            <div>
              No items in your cart or slow internet causing trouble (Refresh
              the page) or you are not logged in
            </div>
            <div>
              <Link to="/">Return to Home page</Link>
            </div>
          </>
        ) : (
          <>
            <h1>Cart</h1>
            {shoppingCart.map((cart) => (
              <div className="cart-card" key={cart.ProductID}>
                <div className="cart-img">
                  <img src={cart.ProductImg} alt="not found" />
                </div>
                <div className="cart-name">{cart.ProductName}</div>
                <div className="cart-price-orignal">
                  Rs {cart.ProductPrice}.00
                </div>
                <div className="inc" onClick={() => handleIncrement(cart)}>
                  <Icon icon={ic_add} size={24} />
                </div>
                <div className="quantity">{cart.qty}</div>
                <div className="dec" onClick={() => handleDecrement(cart)}>
                  <Icon icon={ic_remove} size={24} />
                </div>
                <div className="cart-price">Rs {cart.TotalProductPrice}.00</div>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(cart)}
                >
                  <Icon icon={iosTrashOutline} size={24} />
                </button>
              </div>
            ))}
            <div className="cart-summary">
              <div className="cart-summary-heading">Cart-Summary</div>
              <div className="cart-summary-price">
                <span>Total Price</span>
                <span>{totalPrice}</span>
              </div>
              <div className="cart-summary-price">
                <span>Total Qty</span>
                <span>{totalQty}</span>
              </div>
              <Link to="/cashout" className="cashout-link">
                <button
                  className="btn btn-success btn-md"
                  style={{ marginTop: "5px" }}
                >
                  Cash on delivery
                </button>
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  );
};
