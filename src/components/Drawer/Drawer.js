import React from "react";
import axios from "axios";

import Info from "../Info";
import { useCart } from "../../hooks/useCart";
import AppContext from "../../pages/context";

import styles from "./Drawer.module.scss"


const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const Drawer = ({ onRemove, opened }) => {

  const {
    setCartOpened
  } = React.useContext(AppContext);

  const {cartItems, setCartItems, totalPrice} = useCart();
  const [isOrderComplete, setIsOrderComplete] = React.useState(false);
  const [orderId, setOrderId] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const onClickOrder = async () => {
    try {
        setIsLoading(true);
        const {data} =  await axios.post("https://6381330c9440b61b0d13dfbe.mockapi.io/orders", {items: cartItems});
        setOrderId(data.id)
        setIsOrderComplete(true);
        setCartItems([]);

        for (let i = 0; i < cartItems.length; i++) {
            const item = cartItems[i];
            await axios.delete(`https://6381330c9440b61b0d13dfbe.mockapi.io/cart/${item.id}`);
            await delay(1000)
        }

    } catch (error) {
        alert('Не удалось создать заказ!')
    }
    setIsLoading(false);
  };

  return (
    <div className={`${styles.overlay} ${opened ? styles.overlayVisible : ''}`}>
      <div className={`${styles.drawer}`}>
        <h2 className="mb-30 d-flex justify-between">
          Корзина{" "}
          <img
            onClick={() => setCartOpened(false)}
            className="removeBtn cu-p"
            src="img/btn-remove.svg"
            alt="Close"
          />
        </h2>

        {cartItems.length > 0 ? (
          <div className="d-flex flex-column flex">
            <div className="items">
              {cartItems.map((item, index) => (
                <div className="cartItem d-flex alig-center mb-20" key={index}>
                  <div
                    className="cartItemImg"
                    style={{ backgroundImage: `url(${item.imageUrl})` }}
                  ></div>
                  <div className="mr-20 flex">
                    <p className="mb-5">{item.title}</p>
                    <b>{item.price}</b>
                  </div>
                  <img
                    onClick={() => onRemove(item.id)}
                    className="removeBtn"
                    src="img/btn-remove.svg"
                    alt="Remove"
                  />
                </div>
              ))}
            </div>

            <div className="cartTotalBlock">
              <ul>
                <li>
                  <span>Итого</span>
                  <div></div>
                  <b>{totalPrice} руб.</b>
                </li>
                <li>
                  <span>Налог 5%</span>
                  <div></div>
                  <b>{Math.round(totalPrice * 0.05)} руб.</b>
                </li>
              </ul>
              <button disabled={isLoading} className="greenButton" onClick={onClickOrder}>
                Оформить заказ <img src="img/arrow.svg" alt="Arrow" />
              </button>
            </div>
          </div>
        ) : (
          <Info
            title={isOrderComplete ? "Заказ Оформлен!" : "Корзина Пустая"}
            description={
              isOrderComplete
                ?  `Ваш заказ №${orderId} скоро будет передан курьерской доставке`
                : "Добавьте хотя бы одну пару кроссовок, чтобы сделать заказ."
            }
            image={
              isOrderComplete
                ? "img/complete-order.png"
                : "img/empty-cart.png"
            }
          />
        )}
      </div>
    </div>
  );
};

export default Drawer;
