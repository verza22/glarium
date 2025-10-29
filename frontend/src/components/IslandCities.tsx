import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { ResponseIslandGetInfo } from "@shared/types/responses";

import cityBlue from "../assets/img/island/city_blue.png";
import cityRed from "../assets/img/island/city_red.png";
import cityBlueHover from "../assets/img/island/city_blue_hover.png";
import cityRedHover from "../assets/img/island/city_red_hover.png";
import cityConstr from "../assets/img/island/city_constr.png";
import flag from "../assets/img/island/flag.png";

export type City = ResponseIslandGetInfo["cities"][number] & {
    extraField?: string;
};

interface IslandCitiesProps {
    id: number;
    name: string;
    x: number;
    y: number;
    cities: City[];
    handleCitiesModal: (city: City) => void;
    handleColonizeModal: (position: number) => void
}

interface ObjectPosition {
    top: number;
    left: number;
}

const IslandCities: React.FC<IslandCitiesProps> = ({ id, name, x, y, cities, handleCitiesModal, handleColonizeModal }) => {
    const { t } = useTranslation();
    const [selectedIndex, setSelectedIndex] = useState<number>(-1);

    const objects: ObjectPosition[] = [
        { top: 575, left: 250 },
        { top: 480, left: 185 },
        { top: 380, left: 125 },
        { top: 235, left: 295 },
        { top: 155, left: 415 },
        { top: 135, left: 660 },
        { top: 210, left: 830 },
        { top: 275, left: 1025 },
        { top: 390, left: 1185 },
        { top: 640, left: 1155 },
        { top: 570, left: 950 },
        { top: 680, left: 825 },
        { top: 660, left: 650 },
        { top: 690, left: 475 },
        { top: 740, left: 235 },
        { top: 515, left: 505 },
    ];

    const getLevelClass = (level: number): string => {
        if (level === 0) return "";
        if ([2, 3].includes(level)) return "bg-[position:-76px_0]";
        if ([4, 5, 6].includes(level)) return "bg-[position:-152px_0]";
        if ([7, 8, 9].includes(level)) return "bg-[position:-228px_0]";
        if ([10, 11, 12].includes(level)) return "bg-[position:-305px_0]";
        if ([13, 14, 15].includes(level)) return "bg-[position:-380px_0]";
        if ([16, 17].includes(level)) return "bg-[position:-453px_0]";
        return "bg-[position:-530px_0]";
    };

    const checkCity = (index: number): boolean =>
        cities.some((x) => x.position === index);

    const getCity = (index: number): City | undefined =>
        cities.find((x) => x.position === index);

    const getCityById = (cityId: number): City | undefined =>
        cities.find((x) => x.cityId === cityId);

    const openColonize = (index: number) => {
        handleColonizeModal(index);
    };

    const openCityInfo = (city: City, index: number) => {
        if (city.constructedAt === null) return;
        setSelectedIndex(index);
        handleCitiesModal(city);
        // onOpenModal({ type: 4, info: { city } });
    };

    const focusCity = (cityId: number) => {
        const city = getCityById(cityId);
        if (city) {
            setSelectedIndex(city.position);
            //   onOpenModal({ type: 4, info: { city } });
        }
    };

    //   useEffect(() => {
    //     if (onFocusCity) {
    //       onFocusCity((cityId) => focusCity(cityId));
    //     }
    //   }, []);

    return (
        <div className="relative">
            {objects.map((object, index) => {
                const city = getCity(index);
                const hasCity = checkCity(index);
                const isActive = selectedIndex === index;
                const color = city?.type ? "blue" : "red";

                return (
                    <div
                        key={index}
                        className="absolute cursor-pointer w-[104px] h-[70px]"
                        style={{ top: object.top, left: object.left }}
                    >
                        {hasCity && city ? (
                            <div
                                className="flex justify-center"
                                title={city.name}
                                onClick={() => openCityInfo(city, index)}
                            >

                                <div className="absolute w-[70px] h-[70px] bg-no-repeat bg-center">
                                    <div
                                        className="absolute inset-0 bg-no-repeat bg-center"
                                        style={{
                                            backgroundImage: `url(${color === "blue" ? cityBlue : cityRed})`,
                                            backgroundPosition: "-3px 0",
                                            zIndex: 1,
                                            opacity: isActive ? 0.7 : 1
                                        }}
                                    ></div>

                                    {isActive && (
                                        <div
                                            className="absolute inset-0 bg-no-repeat bg-center transition-all"
                                            style={{
                                                backgroundImage: `url(${color === "blue" ? cityBlueHover : cityRedHover})`,
                                                backgroundPosition: "-3px 0",
                                                zIndex: 3,
                                            }}
                                        ></div>
                                    )}
                                </div>

                                {city.constructedAt ? (
                                    <div
                                        className={`absolute w-[70px] h-[70px] bg-no-repeat bg-center ${getLevelClass(
                                            city.level
                                        )}`}
                                    ></div>
                                ) : (
                                    <img
                                        src={cityConstr}
                                        alt="city_constr"
                                        className="w-[70px] h-[70px] mx-[15px]"
                                    />
                                )}

                                <div className="absolute bottom-[-15px] text-sm text-white font-semibold text-center">
                                    {city.name}
                                </div>
                            </div>
                        ) : (
                            <div
                                title={t("colonize.question")}
                                onClick={() => openColonize(index)}
                            >
                                <img
                                    src={flag}
                                    alt="flag"
                                    className="w-[70px] h-[70px] mx-[35px]"
                                />
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default IslandCities;