import React from "react";
import woodIcon from "../../../assets/img/icon/icon_wood.png";
import wineIcon from "../../../assets/img/icon/icon_wine.png";
import marbleIcon from "../../../assets/img/icon/icon_marble.png";
import glassIcon from "../../../assets/img/icon/icon_glass.png";
import sulfurIcon from "../../../assets/img/icon/icon_sulfur.png";

const Resources: React.FC = () => {
  return (
    <div className="flex-1 flex select-none pl-[5px]">
      <div className="flex-1 flex items-center" title="Wood">
        <img className="mr-1" src={woodIcon} alt="Wood" />
        <span>1000</span>
      </div>

      <div className="flex-1 flex items-center" title="Wine">
        <img className="mr-1" src={wineIcon} alt="Wine" />
        <span>500</span>
      </div>

      <div className="flex-1 flex items-center" title="Marble">
        <img className="mr-1" src={marbleIcon} alt="Marble" />
        <span>200</span>
      </div>

      <div className="flex-1 flex items-center" title="Glass">
        <img className="mr-1" src={glassIcon} alt="Glass" />
        <span>150</span>
      </div>

      <div className="flex-1 flex items-center" title="Sulfur">
        <img className="mr-1" src={sulfurIcon} alt="Sulfur" />
        <span>75</span>
      </div>
    </div>
  );
};

export default Resources;