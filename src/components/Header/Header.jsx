import React from "react";
import "./header.css";
import logocitybike from "../../assets/logocitybike.png";
import { useStateContext } from "../../contexts/contextProvider";

const Header = () => {
  const { setInputValue, selectValue } = useStateContext();
  return (
    <header className="header">
      <img src={logocitybike} alt="Logo" className="logoTransparente" />
      <h2 className="header__title">City Bike</h2>

      <div className="right">
        <h4>Select Country:</h4>
        <select
          className="select"
          onChange={(e) => {
            setInputValue(e.target.value);
          }}
        >
          {selectValue === [] ? (
            <option value="PT">PT</option>
          ) : (
            selectValue.map((value, i) => {
              return (
                <option value={value} key={i}>
                  {value}
                </option>
              );
            })
          )}
        </select>
      </div>
    </header>
  );
};

export default Header;
