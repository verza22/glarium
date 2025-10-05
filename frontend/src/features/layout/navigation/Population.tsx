import React from "react";
import populationIcon from "../../../assets/img/icon/population.png";

const Population: React.FC = () => {
  return (
    <div className="flex-2 flex select-none justify-center items-center" title="Population">
      <div
        className="w-[35px] h-[23px] mr-[5px] bg-cover"
        style={{ backgroundImage: `url(${populationIcon})` }}
      ></div>
      <div>1000 (500)</div>
    </div>
  );
};

export default Population;