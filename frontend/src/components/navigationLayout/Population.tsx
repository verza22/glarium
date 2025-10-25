import React from "react";
import populationIcon from "../../assets/img/icon/population.png";
import { useTranslation } from "react-i18next";

interface PopulationProps {
    population: number,
    populationAvailable: number
}

const Population: React.FC<PopulationProps> = ({population, populationAvailable}) => {
    const { t } = useTranslation();
    
    return (
        <div className="flex-2 flex select-none justify-center items-center" title={t("navigation.population")}>
            <div
                className="w-[35px] h-[23px] mr-[5px] bg-cover"
                style={{ backgroundImage: `url(${populationIcon})` }}
            ></div>
            <div>{populationAvailable} ({population})</div>
        </div>
    );
};

export default Population;