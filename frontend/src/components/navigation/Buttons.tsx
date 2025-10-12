import React from "react";

import btnWorldImg from "../../assets/img/icon/btn_world.png";
import btnIslandImg from "../../assets/img/icon/btn_island.jpg";
import btnCityImg from "../../assets/img/icon/btn_city.png";
import { useTranslation } from "react-i18next";

interface ButtonsProps {
    onNavigation: {
        city: () => void,
        island: () => void,
        world: () => void
    }
}

const Buttons: React.FC<ButtonsProps> = ({onNavigation}) => {
    const { t } = useTranslation();
    

    return (
        <div className="flex-1 flex space-x-1 text-[11px] select-none">
            <div
                onClick={() => onNavigation.world()}
                className="flex-1 relative cursor-pointer h-[53px] bg-no-repeat bg-cover"
                title={t("navigation.world")}
                style={{ backgroundImage: `url(${btnWorldImg})` }}
            >
                <div className="absolute bottom-0 w-full text-center">{t("navigation.world")}</div>
            </div>

            <div
                onClick={() => onNavigation.island()}
                className="flex-1 relative cursor-pointer h-[53px] bg-no-repeat bg-cover"
                title={t("navigation.island")}
                style={{ backgroundImage: `url(${btnIslandImg})` }}
            >
                <div className="absolute bottom-0 w-full text-center">{t("navigation.island")}</div>
            </div>

            <div
                onClick={() => onNavigation.city()}
                className="flex-1 relative cursor-pointer h-[56px] bg-no-repeat bg-cover"
                title={t("navigation.city")}
                style={{ backgroundImage: `url(${btnCityImg})` }}
            >
                <div className="absolute bottom-0 w-full text-center">{t("navigation.city")}</div>
            </div>
        </div>
    );
};

export default Buttons;