import React from "react";

import UserResources from "../components/navigation/UserResources";
import Cities from "../components/navigation/Cities";
import ActionPoint from "../components/navigation/ActionPoint";
import Population from "../components/navigation/Population";
import Buttons from "../components/navigation/Buttons";
import Resources from "../components/navigation/Resources";

import navBackground from "../assets/img/icon/navegacion_fondo.png";

import { useUserStore } from "../store/userStore";
import { useNavigate } from "react-router-dom";

const Navigation: React.FC = () => {

    const navigate = useNavigate();
    const { cityId, islandId } = useUserStore();

    const onNavigation = () => ({
        city: ()=> navigate("/city/"+cityId),
        island: ()=> navigate("/island/"+islandId),
        world: ()=> navigate("/world")
    });

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
                    <Buttons onNavigation={onNavigation()}/>
                </div>
                <Resources />
            </div>
        </div>
    );
};

export default Navigation;