import React from "react";
import { Link } from "react-router-dom";

import AppContext from "../pages/context";
import { useCart } from "../hooks/useCart";

const Header = () => {

  const {setCartOpened} = React.useContext(AppContext);
  const {totalPrice} = useCart();

  return (
    <header className="d-flex justify-between align-center p-40">
      <Link to="/">
        <div className="d-flex align-center">
            <img width={40} height={40} src="img/logo.png" alt="LogoType" />
            <div>
            <h3 className="text-uppercase">React Sneakers</h3>
            <p className="opacity-5">Магазин лучших кросовок</p>
            </div>
        </div>
      </Link>
      <ul className="d-flex">
        <li className="mr-30 cu-p"
            onClick={() => setCartOpened(true)}>
          <img
            width={18}
            height={18}
            src="img/cart.svg"
            alt="Cart"
          />
          <span>{totalPrice} руб</span>
        </li>
        <li className="mr-20 cu-p">
          <Link to="/favorites">
            <img width={18} height={18} src="img/heart.svg" alt="Heart" />
          </Link>
        </li>
        <li>
          <Link to="/orders">
            <img width={18} height={18} src="img/user.png" alt="User" />
          </Link>
        </li>
      </ul>
    </header>
  );
};

export default Header;
