import React, { useState } from "react";
import { useStateContext } from "../../contexts/contextProvider";

import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";

import "./info.css";

const Infos = () => {
  const { inputValue, networksLength, allNetworks } = useStateContext();

  const [handleNetworks, setHandleNetworks] = useState(false);

  return (
    <div className="infos">
      <span>Country: {inputValue}</span>
      <div
        className="networks"
        onClick={() => setHandleNetworks(!handleNetworks)}
      >
        <span>Networks: {networksLength} </span>
        {handleNetworks ? <IoIosArrowUp /> : <IoIosArrowDown />}
      </div>
      <div className="stations">
        {handleNetworks
          ? allNetworks.map((station, i) => {
              return (
                <span key={i}>{`${station.name}: ${station.stationsLen}`}</span>
              );
            })
          : null}
      </div>
    </div>
  );
};

export default Infos;
