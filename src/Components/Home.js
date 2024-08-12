import React, { useEffect } from "react";
import { Navbar } from "./Navbar";
import { Products } from "./Products";
import { useNavigate } from "react-router-dom";
import { auth } from "../Config/Config";

export const Home = ({ user }) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Dinleyiciyi kur ve temizleme işlevini döndür
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate("/login");
      }
    });

    // Temizleme işlevi: bileşen unmount edildiğinde dinleyiciyi temizler
    return () => unsubscribe();
  }, [navigate]); // navigate'yi bağımlı listeye ekliyoruz

  return (
    <div className="wrapper">
      <Navbar user={user} />
      <Products user={user}/>
    </div>
  );
};
