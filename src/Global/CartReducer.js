import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const CartReducer = (state, action) => {
  const { shoppingCart, totalPrice, totalQty } = state;

  let product;
  let index;
  let updatedPrice;
  let updatedQty;

  switch (action.type) {
    case "ADD_TO_CART":
      const check = shoppingCart.find(
        (product) => product.ProductID === action.id
      );

      if (check) {
        toast.info("This product is already in your cart", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
        });
        return state;
      } else if (action.product) {
        product = { ...action.product, qty: 1 };
        product.TotalProductPrice = product.ProductPrice * product.qty;
        updatedQty = totalQty + 1;
        updatedPrice = totalPrice + product.ProductPrice;

        return {
          shoppingCart: [product, ...shoppingCart],
          totalPrice: updatedPrice,
          totalQty: updatedQty,
        };
      } else {
        console.error("Product is undefined or null.");
        return state;
      }

    case "INC":
      product = { ...action.cart, qty: action.cart.qty + 1 };
      product.TotalProductPrice = product.qty * product.ProductPrice;
      updatedQty = totalQty + 1;
      updatedPrice = totalPrice + product.ProductPrice;

      const updatedCartInc = shoppingCart.map((cart) =>
        cart.ProductID === action.id ? product : cart
      );

      return {
        shoppingCart: updatedCartInc,
        totalPrice: updatedPrice,
        totalQty: updatedQty,
      };

    case "DEC":
      if (action.cart.qty > 1) {
        product = { ...action.cart, qty: action.cart.qty - 1 };
        product.TotalProductPrice = product.qty * product.ProductPrice;
        updatedPrice = totalPrice - product.ProductPrice;
        updatedQty = totalQty - 1;

        const updatedCartDec = shoppingCart.map((cart) =>
          cart.ProductID === action.id ? product : cart
        );

        return {
          shoppingCart: updatedCartDec,
          totalPrice: updatedPrice,
          totalQty: updatedQty,
        };
      } else {
        // Ürün miktarı 1 ise, ürün sepetten kaldırılır
        return CartReducer(state, { type: "DELETE", id: action.id, cart: action.cart });
      }

    case "DELETE":
      const filtered = shoppingCart.filter(
        (product) => product.ProductID !== action.id
      );
      product = action.cart;
      updatedQty = totalQty - product.qty;
      updatedPrice = totalPrice - product.qty * product.ProductPrice;

      toast.success("Product removed from cart", {
        position: "top-right",
        autoClose: 2000,
      });

      return {
        shoppingCart: filtered,
        totalPrice: updatedPrice,
        totalQty: updatedQty,
      };

    case "EMPTY":
      return {
        shoppingCart: [],
        totalPrice: 0,
        totalQty: 0,
      };

    default:
      return state;
  }
};
