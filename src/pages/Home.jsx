import React from "react";

import AppContext from "./context";
import Card from "../components/Card/Card";

const Home = ({
  items,
  searchValue,
  setSearchValue,
  onChangeSearchInput,
  onAddToCart,
  isLoading
}) => {

  const {onAddToFavorite} = React.useContext(AppContext);
  
  const filteredItems = items.filter((item) => item.title.toLowerCase().includes(searchValue.toLocaleLowerCase()));

  const renderItems = () => {
    return (isLoading ? [...Array(8)] : filteredItems)        
    .map((item, index) => (
      <Card
        key={index}
        onFavorite={(obj) => onAddToFavorite(obj)}
        onPlus={(obj) => onAddToCart(obj)}
        {...item}
        loading={isLoading}
      />
    ))
  }

  return (
    <div className="content p-40">
      <div className="d-flex align-center justify-between mb-40 ">
        <h1>
          {searchValue ? `Поиск по запросу: "${searchValue}"` : "Все кросcовки"}
        </h1>
        <div className="search-block d-flex">
          <img src="img/search.svg" alt="Search" />
          {searchValue && (
            <img
              className="clear cu-p"
              src="img/btn-remove.svg"
              alt="Clear"
              onClick={() => setSearchValue("")}
            />
          )}
          <input
            onChange={onChangeSearchInput}
            value={searchValue}
            placeholder="Поиск..."
          />
        </div>
      </div>

      <div className="d-flex flex-wrap">
        {renderItems()}
      </div>
    </div>
  );
};

export default Home;
