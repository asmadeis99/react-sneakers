import axios from "axios";
import React, {useState, useEffect} from "react";

import Card from "../components/Card/Card";
import AppContext from "./context";

const Orders = () => {

  const [orders, setOrders] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    (async () => {
      try {
        const {data} = await axios.get('https://6381330c9440b61b0d13dfbe.mockapi.io/orders');
        const allOrders = data.reduce((prev, obj) => [...prev, ...obj.items], []);
        
        setOrders(allOrders);
        setIsLoading(false);
      } catch (error) {
        alert('шо-та не грузится дядя, говной твой тырнет')
      }

    })()
  }, [])


  return (
    <div className="content p-40">
      <div className="d-flex align-center justify-between mb-40 ">
        <h1>Мои заказы</h1>
      </div>
      
      <div className="d-flex flex-wrap">
        {(isLoading ? [...Array(8)] : orders).map((item, index) => (
          <Card
          key={index}
          {...item}
          loading={isLoading}
        />
        ))}
      </div>
    </div>
  );
};

export default Orders;
