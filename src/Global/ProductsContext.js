import React, { createContext } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../Config/Config";

export const ProductsContext = createContext();

export class ProductsContextProvider extends React.Component {
  state = {
    products: [],
  };

  componentDidMount() {
    const productsCollection = collection(db, "Products");

    // Firestore dinleyici
    this.unsubscribe = onSnapshot(
      productsCollection,
      (snapshot) => {
        const products = snapshot.docs.map((doc) => ({
          ProductID: doc.id,
          ProductName: doc.data().ProductName,
          ProductPrice: doc.data().ProductPrice,
          ProductImg: doc.data().ProductImg,
        }));
        this.setState({ products });
      },
      (error) => {
        console.error("Firestore snapshot error:", error);
      }
    );
  }

  componentWillUnmount() {
    // Dinleyiciyi temizle
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  render() {
    return (
      <ProductsContext.Provider value={{ products: this.state.products }}>
        {this.props.children}
      </ProductsContext.Provider>
    );
  }
}
