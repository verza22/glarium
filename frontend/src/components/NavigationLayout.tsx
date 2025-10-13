import React from "react";

import UserResources from "./navigationLayout/UserResources";
import Cities from "./navigationLayout/Cities";
import ActionPoint from "./navigationLayout/ActionPoint";
import Population from "./navigationLayout/Population";
import Buttons from "./navigationLayout/Buttons";
import Resources from "./navigationLayout/Resources";

import navBackground from "../assets/img/icon/navegacion_fondo.png";
import { INavigationLayout } from "../hooks/useNavigationLayout";
import { ResponseCityGetInfo } from "@shared/types/responses";

interface NavigationLayoutProps {
    navigationLayout: INavigationLayout,
    data: ResponseCityGetInfo
}

const NavigationLayout: React.FC<NavigationLayoutProps> = ({navigationLayout, data}) => {
    return (
        <div
            className="absolute z-20 w-[600px] rounded-md text-[0.83rem] p-[18px_40px_20px_10px] flex"
            style={{ backgroundImage: `url(${navBackground})`, backgroundRepeat: "no-repeat" }}
        >
            <UserResources gold={data.userResources.gold} ships={data.userResources.tradeShip} shipsAvailable={data.userResources.tradeShipAvailable} />
            <div className="flex-1 flex flex-col">
                <div className="flex-2 flex">
                    <div className="flex-1 flex flex-col pl-1.5">
                        <Cities cities={data.cities}  />
                        <div className="flex-1 flex">
                            <ActionPoint point={data.actionPoints.point} pointMax={data.actionPoints.pointMax}  />
                            <Population population={data.population.population} populationAvailable={data.population.populationAvailable} />
                        </div>
                    </div>
                    <Buttons navigationLayout={navigationLayout}/>
                </div>
                <Resources 
                    wood={data.resources.wood}
                    wine={data.resources.wine}
                    marble={data.resources.marble}
                    glass={data.resources.glass}
                    sulfur={data.resources.sulfur}
                />
            </div>
        </div>
    );
};

export default NavigationLayout;