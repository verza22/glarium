import React from "react";
import { useNavigate } from "react-router-dom";

import btnWorldImg from "../../../assets/img/icon/btn_world.png";
import btnIslandImg from "../../../assets/img/icon/btn_island.jpg";
import btnCityImg from "../../../assets/img/icon/btn_city.png";

const Buttons: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex space-x-1 text-[11px] select-none">
      <div
        onClick={() => navigate("/world")}
        className="flex-1 relative cursor-pointer h-[53px] bg-no-repeat bg-cover"
        title="World"
        style={{ backgroundImage: `url(${btnWorldImg})` }}
      >
        <div className="absolute bottom-0 w-full text-center">World</div>
      </div>

      <div
        onClick={() => navigate("/island")}
        className="flex-1 relative cursor-pointer h-[53px] bg-no-repeat bg-cover"
        title="Island"
        style={{ backgroundImage: `url(${btnIslandImg})` }}
      >
        <div className="absolute bottom-0 w-full text-center">Island</div>
      </div>

      <div
        onClick={() => navigate("/")}
        className="flex-1 relative cursor-pointer h-[56px] bg-no-repeat bg-cover"
        title="City"
        style={{ backgroundImage: `url(${btnCityImg})` }}
      >
        <div className="absolute bottom-0 w-full text-center">City</div>
      </div>
    </div>
  );
};

export default Buttons;