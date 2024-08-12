import React, { useState, useEffect, useContext } from "react";
import { auth, db } from "../Config/Config";
import { CartContext } from "../Global/CartContext";
import { Navbar } from "./Navbar";
import { useNavigate } from "react-router-dom";
import { doc, onSnapshot, setDoc } from "firebase/firestore";

export const Cashout = (props) => {
  const navigate = useNavigate();
  const { shoppingCart, totalPrice, totalQty, dispatch } =
    useContext(CartContext);

  // Defining state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [cell, setCell] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const userDocRef = doc(db, "SignedUpUsersData", user.uid);
        onSnapshot(userDocRef, (snapshot) => {
          if (snapshot.exists()) {
            setName(snapshot.data().Name);
            setEmail(snapshot.data().Email);
          }
        });
      } else {
        navigate("/login");
      }
    });

    // Cleanup on unmount
    return () => unsubscribe();
  }, [navigate]);

  const cashoutSubmit = (e) => {
    e.preventDefault();
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        const date = new Date();
        const time = date.getTime();
        try {
          const orderDocRef = doc(db, `Buyer-info ${user.uid}`, `_${time}`);
          await setDoc(orderDocRef, {
            BuyerName: name,
            BuyerEmail: email,
            BuyerCell: cell,
            BuyerAddress: address,
            BuyerPayment: totalPrice,
            BuyerQuantity: totalQty,
          });
          setCell("");
          setAddress("");
          dispatch({ type: "EMPTY" });
          setSuccessMsg(
            "Your order has been placed successfully. Thanks for visiting us. You will be redirected to the home page after 5 seconds."
          );
          setTimeout(() => {
            navigate("/");
          }, 5000);
        } catch (err) {
          setError(err.message);
        }
      }
    });
  };

  return (
    <>
      <Navbar user={props.user} />
      <div className="container">
        <br />
        <h2>Cashout Details</h2>
        <br />
        {successMsg && <div className="success-msg">{successMsg}</div>}
        <form autoComplete="off" className="form-group" onSubmit={cashoutSubmit}>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            className="form-control"
            required
            value={name}
            disabled
          />
          <br />
          <label htmlFor="email">Email</label>
          <input
            type="email"
            className="form-control"
            required
            value={email}
            disabled
          />
          <br />
          <label htmlFor="cell">Cell No</label>
          <input
            type="number"
            className="form-control"
            required
            onChange={(e) => setCell(e.target.value)}
            value={cell}
            placeholder="e.g. 03123456789"
          />
          <br />
          <label htmlFor="address">Delivery Address</label>
          <input
            type="text"
            className="form-control"
            required
            onChange={(e) => setAddress(e.target.value)}
            value={address}
          />
          <br />
          <label htmlFor="totalPrice">Price To Pay</label>
          <input
            type="number"
            className="form-control"
            required
            value={totalPrice}
            disabled
          />
          <br />
          <label htmlFor="totalQty">Total No of Products</label>
          <input
            type="number"
            className="form-control"
            required
            value={totalQty}
            disabled
          />
          <br />
          <button type="submit" className="btn btn-success btn-md mybtn">
            SUBMIT
          </button>
        </form>
        {error && <span className="error-msg">{error}</span>}
      </div>
    </>
  );
};
