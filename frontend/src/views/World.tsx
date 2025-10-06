import React from "react";
import DragToScroll from "../components/DragToScroll";
import OceanImg from "../assets/img/world/ocean.png";
import Layout from "../features/layout/Layout";

const WorldUI: React.FC = () => {
    return <>
        <Layout />
        <div className="cursor-grab h-full w-full absolute overflow-hidden">
            <DragToScroll className="scroll-container">
                <div
                    className="w-[100000px] h-[100000px] bg-cover bg-no-repeat"
                    style={{ backgroundImage: `url(${OceanImg})` }}
                >
                </div>
            </DragToScroll>
        </div>
    </>
};

export default WorldUI;