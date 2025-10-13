import React from "react";
import actionImg from "../../assets/img/icon/action_point.png";
import { useTranslation } from "react-i18next";

interface ActionPointProps {
    pointMax: number, 
    point: number
}

const ActionPoint: React.FC<ActionPointProps> = ({point, pointMax}) => {
    const { t } = useTranslation();
    
    return (
        <div className="flex-1 flex items-center justify-center select-none" title={t("navigation.actionPoint")}>
            <div
                className="w-[25px] h-[25px] mr-2"
                style={{ backgroundImage: `url(${actionImg})`, backgroundSize: "cover" }}
            ></div>
            <div>{point}/{pointMax}</div>
        </div>
    );
};

export default ActionPoint;