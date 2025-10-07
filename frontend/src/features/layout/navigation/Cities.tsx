import React from "react";
import navSelected from "../../../assets/img/icon/navigation-selected.jpg";
import navOther from "../../../assets/img/icon/navigation-other.jpg";
import navFooter from "../../../assets/img/icon/navigation-footer.jpg";
import { useTranslation } from "react-i18next";

const Cities: React.FC = () => {
    const { t } = useTranslation();
    
    return (
        <div className="relative select-none flex-1">
            <div
                className="h-[23px] cursor-pointer bg-cover"
                title={t("navigation.showCities")}
                style={{ backgroundImage: `url(${navSelected})` }}
            >
                <div className="relative top-[2px] left-[6px] text-[11px]">[12:34] Example City</div>
            </div>

            {/* <div className="absolute w-full">
                <div
                    className="h-[23px] cursor-pointer bg-cover"
                    style={{ backgroundImage: `url(${navOther})`, backgroundPositionY: "28px" }}
                >
                    <div className="relative top-[2px] left-[6px] text-[11px]">[56:78] Another City</div>
                </div>
                <div
                    className="h-[23px] cursor-pointer bg-cover"
                    style={{ backgroundImage: `url(${navOther})`, backgroundPositionY: "28px" }}
                >
                    <div className="relative top-[2px] left-[6px] text-[11px]">[90:12] Third City</div>
                </div>
                <div className="h-[5px] bg-cover" style={{ backgroundImage: `url(${navFooter})` }}></div>
            </div> */}
        </div>
    );
};

export default Cities;