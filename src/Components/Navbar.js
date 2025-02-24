import React, { useContext } from "react";
import logo from "../images/ecommerce.svg";
import { Link, useNavigate } from "react-router-dom";
import { Icon } from "react-icons-kit";
import { cart } from "react-icons-kit/entypo/cart";
import { CartContext } from "../Global/CartContext";
import { auth } from "../Config/Config";

export const Navbar = ({ user }) => {
  const navigate = useNavigate();
  const { totalQty } = useContext(CartContext);

  // handle logout
  const handleLogout = () => {
    auth.signOut().then(() => {
      navigate("/login");
    });
  };

  return (
    <div className="navbox">
      <div className="leftside">
        <img src={logo} alt="" />
      </div>
      {!user && (
        <div className="rightside">
          <span>
            <Link to="signup" className="navlink">
              SIGN UP
            </Link>
          </span>
          <span>
            <Link to="login" className="navlink">
              LOGIN
            </Link>
          </span>
        </div>
      )}
      {user && (
        <div className="rightside">
          <span>
            <Link to="/" className="navlink">
              {user}
            </Link>
          </span>
          <span>
            <Link to="/cartproducts" className="navlink">
              <Icon icon={cart} />
            </Link>
          </span>
          <span className="no-of-products">{totalQty}</span>
          <span>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </span>
        </div>
      )}
    </div>
  );
};
