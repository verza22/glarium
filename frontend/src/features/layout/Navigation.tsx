import React from "react";
import UserResources from "./navigation/UserResources";
import Cities from "./navigation/Cities";
import ActionPoint from "./navigation/ActionPoint";
import Population from "./navigation/Population";
import Buttons from "./navigation/Buttons";
import Resources from "./navigation/Resources";
import navBackground from "../../assets/img/icon/navegacion_fondo.png";

const Navigation: React.FC = () => {
  return (
    <div
      className="absolute z-20 w-[600px] rounded-md text-[0.83rem] p-[18px_40px_20px_10px] flex"
      style={{ backgroundImage: `url(${navBackground})`, backgroundRepeat: "no-repeat" }}
    >
      <UserResources />
      <div className="flex-1 flex flex-col">
        <div className="flex-2 flex">
          <div className="flex-1 flex flex-col pl-1.5">
            <Cities />
            <div className="flex-1 flex">
              <ActionPoint />
              <Population />
            </div>
          </div>
          <Buttons />
        </div>
        <Resources />
      </div>
    </div>
  );
};

export default Navigation;