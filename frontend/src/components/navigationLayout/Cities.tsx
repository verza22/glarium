import React, { useState } from "react";
import navSelected from "../../assets/img/icon/navigation-selected.jpg";
import { useTranslation } from "react-i18next";
import { CityFlat } from "@shared/types/models";
import { useUserStore } from "../../store/userStore";
import { useNavigate } from "react-router-dom";
import { useChangeCity } from "../../hooks/useChangeCity";

interface CitiesProps {
    cities: CityFlat[];
}

const Cities: React.FC<CitiesProps> = ({ cities }) => {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const cityId = useUserStore(state => state.cityId);
    const changeCity = useChangeCity();

    const sortedCities = [...cities].sort((a, b) => (a.id === cityId ? -1 : b.id === cityId ? 1 : 0));

    const handleCityClick = (index: number, city: CityFlat) => {
        if (index === 0) {
            setOpen(!open);
        } else {
            setOpen(false);
            changeCity({
                cityId: city.id,
                islandId: city.island_id,
                islandX: city.x,
                islandY: city.y
            });
        }
    };

    return (
        <div className="relative select-none flex-1">
            <div
                className={`h-[23px] cursor-pointer bg-cover ${open ? "" : "overflow-hidden"}`}
                title={t("navigation.showCities")}
                style={{ backgroundImage: `url(${navSelected})` }}
            >
                {sortedCities.map((city, index) => (
                    <div
                        key={city.id}
                        onClick={() => handleCityClick(index, city)}
                        className={`relative top-[3px] left-[6px] text-[12px] cursor-pointer px-1`}
                        style={{
                            backgroundColor: index !== 0 ? "#d8cba5" : "transparent",
                        }}
                    >
                        [{city.x}:{city.y}] {city.name}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Cities;