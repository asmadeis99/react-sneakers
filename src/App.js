import React, { useState, useEffect } from "react";
import axios from "axios";
import { Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Drawer from "./components/Drawer/Drawer";
import Home from "./pages/Home";
import Favorites from "./pages/Favorites";
import AppContext from "./pages/context";
import Orders from "./pages/Orders";

function App() {
  const [items, setItems] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [cartOpened, setCartOpened] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {

        const [itemsResponse, cartResponse, favoritesResponse] = 
          await Promise.all([
            axios.get("https://6381330c9440b61b0d13dfbe.mockapi.io/items"),
            axios.get("https://6381330c9440b61b0d13dfbe.mockapi.io/cart"),
            axios.get("https://6381330c9440b61b0d13dfbe.mockapi.io/favorites")
        ]);

        setCartItems(cartResponse.data);
        setFavorites(favoritesResponse.data);
        setItems(itemsResponse.data);
        setIsLoading(false);
      } catch (error) {
        alert('Ошибка при запросе данных')
      }
    };

    fetchData();
  }, []);

  const onAddToCart = async (obj) => {
    try {
      const findItem = cartItems.find((item) => Number(item.parentId) === Number(obj.id));
      if (findItem) {
        setCartItems((prev) =>prev.filter((item) => Number(item.parentId) !== Number(obj.id)));
        axios.delete(
          `https://6381330c9440b61b0d13dfbe.mockapi.io/cart/${findItem.id}`
        );
      } else {
        setCartItems((prev) => [...prev, obj]);
        const {data} = await axios.post("https://6381330c9440b61b0d13dfbe.mockapi.io/cart", obj);
        setCartItems((prev) => prev.map((item) => {
          if(item.parentId === data.parentId) {
            return {...item, id: data.id}
          }
          return item;
        }))
      }
    } catch (error) {
      alert(error);
    }
  };

  const onRemoveItem = async (id) => {
    try {
      axios.delete(`https://6381330c9440b61b0d13dfbe.mockapi.io/cart/${id}`);
      setCartItems((prev) =>
        prev.filter((item) => Number(item.id) !== Number(id))
      );
    } catch (error) {
      alert('удалить не получилось')
    }
  };

  const onAddToFavorite = async (obj) => {
    try {
      if (favorites.find((favObj) => Number(favObj.id) === Number(obj.id))) {
        axios.delete(
          `https://6381330c9440b61b0d13dfbe.mockapi.io/favorites/${obj.id}`
        );
        setFavorites((prev) =>
          prev.filter((item) => Number(item.id) !== Number(obj.id))
        );
      } else {
        const { data } = await axios.post(
          "https://6381330c9440b61b0d13dfbe.mockapi.io/favorites",
          obj
        );
        setFavorites((prev) => [...prev, data]);
      }
    } catch (error) {
      alert("Не удалось добавить в фаворит.");
    }
  };

  const onChangeSearchInput = (event) => {
    setSearchValue(event.target.value);
  };

  const isItemAdded = (id) => {
    console.log(id)
    return cartItems.some((obj) => Number(obj.parentId) === Number(id));
  };

  return (
    <AppContext.Provider
      value={{
        items,
        cartItems,
        favorites,
        isItemAdded,
        onAddToFavorite,
        onAddToCart,
        setCartOpened,
        setCartItems,
      }}
    >
      <div className="wrapper clear">
        <Drawer onRemove={onRemoveItem} opened={cartOpened}/>

        <Header />

        <Routes>
          <Route
            path="/"
            element={
              <Home
                items={items}
                cartItems={cartItems}
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                onChangeSearchInput={onChangeSearchInput}
                onAddToCart={onAddToCart}
                isLoading={isLoading}
              />
            }
          ></Route>

          <Route path="/favorites" exact element={<Favorites />}></Route>
          <Route path="/orders" exact element={<Orders />}></Route>
        </Routes>
      </div>
    </AppContext.Provider>
  );
}

export default App;
