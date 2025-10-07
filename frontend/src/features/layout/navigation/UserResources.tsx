import React from "react";
import shipsImg from "../../../assets/img/icon/ships.jpg";
import goldImg from "../../../assets/img/icon/gold.jpg";
import premiumImg from "../../../assets/img/icon/premium.png";
import { useTranslation } from "react-i18next";

const UserResources: React.FC = () => {
    const { t } = useTranslation();

    return (
        <div className="select-none">
            <a href="https://www.patreon.com/glarium" target="_blank" rel="noreferrer">
                <div
                    className="w-[110px] h-[30px] cursor-pointer bg-cover flex justify-center items-center"
                    title={t("navigation.patreon")}
                    style={{ backgroundImage: `url(${premiumImg})` }}
                >
                    <div className="text-white p-1 text-center">{t("navigation.patreon")}</div>
                </div>
            </a>

            <div
                className="w-[110px] h-[30px] cursor-pointer bg-no-repeat flex items-center justify-end pl-[42px]"
                title={t("resources.ships")}
                style={{ backgroundImage: `url(${shipsImg})`, backgroundPositionY: "0" }}
            >
                <div>5/10</div>
            </div>

            <div
                className="w-[110px] h-[30px] cursor-pointer bg-no-repeat flex items-center justify-end pl-[42px]"
                title={t("resources.gold")}
                style={{ backgroundImage: `url(${goldImg})`, backgroundPositionY: "0" }}
            >
                <div>1500</div>
            </div>
        </div>
    );
};

export default UserResources;