import React, { useEffect, useState } from "react";
import { ProductsContextProvider } from "./Global/ProductsContext";
import { Home } from "./Components/Home";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Signup } from "./Components/Signup";
import { Login } from "./Components/Login";
import { NotFound } from "./Components/NotFound";
import { auth, db } from "./Config/Config";
import { CartContextProvider } from "./Global/CartContext";
import { Cart } from "./Components/Cart";
import { AddProducts } from "./Components/AddProducts";
import { Cashout } from "./Components/Cashout";
import { ToastContainer } from "react-toastify";
import { doc, getDoc } from "firebase/firestore";

const App = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate(); // useNavigate hook'u kullanarak yönlendirme işlemini yapıyoruz

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (authUser) => {
      if (authUser) {
        const userDoc = doc(db, "SignedUpUsersData", authUser.uid);
        const snapshot = await getDoc(userDoc);
        if (snapshot.exists()) {
          setUser(snapshot.data().Name);
          // Eğer kullanıcı giriş yaptıysa ana sayfaya yönlendirin
          if (window.location.pathname === "/login") {
            navigate("/");
          }
        }
      } else {
        setUser(null);
        // Kullanıcı oturum açmamışsa login sayfasına yönlendirin
        if (window.location.pathname !== "/login") {
          navigate("/login");
        }
      }
    });

    // Unsubscribe from the listener when the component unmounts
    return () => unsubscribe();
  }, [navigate]);

  return (
    <ProductsContextProvider>
      <CartContextProvider>
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cartproducts" element={<Cart user={user} />} />
          <Route path="/addproducts" element={<AddProducts />} />
          <Route path="/cashout" element={<Cashout user={user} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <ToastContainer />
      </CartContextProvider>
    </ProductsContextProvider>
  );
};

export default App;
