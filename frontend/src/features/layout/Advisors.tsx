import React from "react";
import containerImg from "../../assets/img/advisor/container.png";
import mayorImg from "../../assets/img/advisor/mayor.png";
import generalImg from "../../assets/img/advisor/general.png";
import scientistImg from "../../assets/img/advisor/scientist.png";
import diplomatImg from "../../assets/img/advisor/diplomat.png";
import { useTranslation } from "react-i18next";

const Advisors: React.FC = () => {

    const { t } = useTranslation();
    return (
        <div className="absolute right-1 z-20">
            <div
                className="w-[394px] h-[130px] pt-[19px] pl-[16px] relative flex"
                style={{ backgroundImage: `url(${containerImg})` }}
            >
                <div
                    className="w-[90px] h-[108px] relative cursor-pointer flex-shrink-0"
                    style={{ backgroundImage: `url(${mayorImg})` }}
                    title={t("mayor")}
                >
                    <div className="absolute bottom-0 w-full text-center text-[11px] px-1">{t("mayor")}</div>
                </div>

                <div
                    className="w-[90px] h-[108px] relative cursor-pointer flex-shrink-0"
                    style={{ backgroundImage: `url(${generalImg})` }}
                    title={t("general")}
                >
                    <div className="absolute bottom-0 w-full text-center text-[11px] px-1">{t("general")}</div>
                </div>

                <div
                    className="w-[90px] h-[108px] relative cursor-pointer flex-shrink-0"
                    style={{ backgroundImage: `url(${scientistImg})` }}
                    title={t("scientist")}
                >
                    <div className="absolute bottom-0 w-full text-center text-[11px] px-1">{t("scientist")}</div>
                </div>

                <div
                    className="w-[90px] h-[108px] relative cursor-pointer flex-shrink-0"
                    style={{ backgroundImage: `url(${diplomatImg})` }}
                    title={t("diplomat")}
                >
                    <div className="absolute bottom-0 w-full text-center text-[11px] px-1">{t("diplomat")}</div>
                </div>
            </div>
        </div>
    );
};

export default Advisors;