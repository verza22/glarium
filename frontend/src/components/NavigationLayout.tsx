import React from "react";

import UserResources from "./navigationLayout/UserResources";
import Cities from "./navigationLayout/Cities";
import ActionPoint from "./navigationLayout/ActionPoint";
import Population from "./navigationLayout/Population";
import Buttons from "./navigationLayout/Buttons";
import Resources from "./navigationLayout/Resources";

import navBackground from "../assets/img/icon/navegacion_fondo.png";
import { INavigationLayout } from "../hooks/useNavigationLayout";

interface NavigationLayoutProps {
    navigationLayout: INavigationLayout
}

const NavigationLayout: React.FC<NavigationLayoutProps> = ({navigationLayout}) => {
    return (
        <div
            className="absolute z-20 w-[600px] rounded-md text-[0.83rem] p-[18px_40px_20px_10px] flex"
            style={{ backgroundImage: `url(${navBackground})`, backgroundRepeat: "no-repeat" }}
        >
            <UserResources />
            <div className="flex-1 flex flex-col">
                <div className="flex-2 flex">
                    <div className="flex-1 flex flex-col pl-1.5">
                        <Cities />
                        <div className="flex-1 flex">
                            <ActionPoint />
                            <Population />
                        </div>
                    </div>
                    <Buttons navigationLayout={navigationLayout}/>
                </div>
                <Resources />
            </div>
        </div>
    );
};

export default NavigationLayout;