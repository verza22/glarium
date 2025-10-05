import React from "react";
import shipsImg from "../../../assets/img/icon/ships.jpg";
import goldImg from "../../../assets/img/icon/gold.jpg";
import premiumImg from "../../../assets/img/icon/premium.png";

const UserResources: React.FC = () => {
  return (
    <div className="select-none">
      <a href="https://www.patreon.com/glarium" target="_blank" rel="noreferrer">
        <div
          className="w-[110px] h-[30px] cursor-pointer bg-cover flex justify-center items-center"
          title="Patreon"
          style={{ backgroundImage: `url(${premiumImg})` }}
        >
          <div className="text-white p-1 text-center">Patreon</div>
        </div>
      </a>

      <div
        className="w-[110px] h-[30px] cursor-pointer bg-no-repeat flex items-center justify-end pl-[42px]"
        title="Ships"
        style={{ backgroundImage: `url(${shipsImg})`, backgroundPositionY: "0" }}
      >
        <div>5/10</div>
      </div>

      <div
        className="w-[110px] h-[30px] cursor-pointer bg-no-repeat flex items-center justify-end pl-[42px]"
        title="Gold"
        style={{ backgroundImage: `url(${goldImg})`, backgroundPositionY: "0" }}
      >
        <div>1500</div>
      </div>
    </div>
  );
};

export default UserResources;