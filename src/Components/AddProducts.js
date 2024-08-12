import React, { useState } from "react";
import { storage, db } from "../Config/Config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";

export const AddProducts = () => {
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState(0);
  const [productImg, setProductImg] = useState(null);
  const [error, setError] = useState("");

  const types = ["image/png", "image/jpeg" ,"image/webp"]; // image types

  const productImgHandler = (e) => {
    let selectedFile = e.target.files[0];
    if (selectedFile && types.includes(selectedFile.type)) {
      setProductImg(selectedFile);
      setError("");
    } else {
      setProductImg(null);
      setError("Please select a valid image type (jpg or png)");
    }
  };

  // add product
  const addProduct = async (e) => {
    e.preventDefault();
    if (!productImg) {
      setError("Please upload an image");
      return;
    }

    try {
      const productImgRef = ref(storage, `product-images/${productImg.name}`);
      const uploadResult = await uploadBytes(productImgRef, productImg);
      const url = await getDownloadURL(uploadResult.ref);

      await addDoc(collection(db, "Products"), {
        ProductName: productName,
        ProductPrice: Number(productPrice),
        ProductImg: url,
      });

      setProductName("");
      setProductPrice(0);
      setProductImg(null);
      setError("");
      document.getElementById("file").value = "";
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container">
      <br />
      <h2>ADD PRODUCTS</h2>
      <hr />
      <form autoComplete="off" className="form-group" onSubmit={addProduct}>
        <label htmlFor="product-name">Product Name</label>
        <input
          type="text"
          className="form-control"
          required
          onChange={(e) => setProductName(e.target.value)}
          value={productName}
        />
        <br />
        <label htmlFor="product-price">Product Price</label>
        <input
          type="number"
          className="form-control"
          required
          onChange={(e) => setProductPrice(e.target.value)}
          value={productPrice}
        />
        <br />
        <label htmlFor="product-img">Product Image</label>
        <input
          type="file"
          className="form-control"
          id="file"
          required
          onChange={productImgHandler}
        />
        <br />
        <button type="submit" className="btn btn-success btn-md mybtn">
          ADD
        </button>
      </form>
      {error && <span className="error-msg">{error}</span>}
    </div>
  );
};
