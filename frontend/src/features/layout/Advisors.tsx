import React from "react";
import containerImg from "../../assets/img/advisor/container.png";
import mayorImg from "../../assets/img/advisor/mayor.png";
import generalImg from "../../assets/img/advisor/general.png";
import scientistImg from "../../assets/img/advisor/scientist.png";
import diplomatImg from "../../assets/img/advisor/diplomat.png";

const Advisors: React.FC = () => {
  return (
    <div className="absolute right-1 z-20">
      <div
        className="w-[394px] h-[130px] pt-[19px] pl-[16px] relative flex"
        style={{ backgroundImage: `url(${containerImg})` }}
      >
        <div
          className="w-[90px] h-[108px] relative cursor-pointer flex-shrink-0"
          style={{ backgroundImage: `url(${mayorImg})` }}
          title="Mayor"
        >
          <div className="absolute bottom-0 w-full text-center text-[11px] px-1">Mayor</div>
        </div>

        <div
          className="w-[90px] h-[108px] relative cursor-pointer flex-shrink-0"
          style={{ backgroundImage: `url(${generalImg})` }}
          title="General"
        >
          <div className="absolute bottom-0 w-full text-center text-[11px] px-1">General</div>
        </div>

        <div
          className="w-[90px] h-[108px] relative cursor-pointer flex-shrink-0"
          style={{ backgroundImage: `url(${scientistImg})` }}
          title="Scientist"
        >
          <div className="absolute bottom-0 w-full text-center text-[11px] px-1">Scientist</div>
        </div>

        <div
          className="w-[90px] h-[108px] relative cursor-pointer flex-shrink-0"
          style={{ backgroundImage: `url(${diplomatImg})` }}
          title="Diplomat"
        >
          <div className="absolute bottom-0 w-full text-center text-[11px] px-1">Diplomat</div>
        </div>

        <div className="absolute top-0 right-0 w-6 h-6 bg-red-500"></div>
      </div>
    </div>
  );
};

export default Advisors;