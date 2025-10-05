import React from "react";
import actionImg from "../../../assets/img/icon/action_point.png";

const ActionPoint: React.FC = () => {
  return (
    <div className="flex-1 flex items-center justify-center select-none" title="Action Points">
      <div
        className="w-[25px] h-[25px] mr-2"
        style={{ backgroundImage: `url(${actionImg})`, backgroundSize: "cover" }}
      ></div>
      <div>0/0</div>
    </div>
  );
};

export default ActionPoint;