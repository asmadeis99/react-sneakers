import React from "react";
import AppContext from "../pages/context";

export const useCart = () => {
    const {cartItems, setCartItems} = React.useContext(AppContext);
    const totalPrice = cartItems.reduce((sum, item) => sum + Number(item.price), 0);

    return {cartItems, setCartItems, totalPrice}
};