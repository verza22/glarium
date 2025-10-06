import React from "react";
import DragToScroll from "../components/DragToScroll";

import OceanImg from "../assets/img/island/ocean.jpg";
import IslandImg from "../assets/img/island/0.jpg";
import Layout from "../features/layout/Layout";
// import Cities from "../components/island/Cities";
// import Resources from "../components/island/Resources";

const IslandUI: React.FC = () => {
    return <>
        <Layout />
        <div className="cursor-grab h-full w-full absolute overflow-hidden">
            <DragToScroll className="scroll-container" centerVertical>
                <div
                    className="relative w-[2400px] h-[1800px] bg-cover bg-no-repeat"
                    style={{ backgroundImage: `url(${OceanImg})` }}
                >
                    <div
                        className="absolute top-[430px] left-[500px] w-[1386px] h-[924px] bg-cover bg-no-repeat z-10"
                        style={{ backgroundImage: `url(${IslandImg})` }}
                    >
                        {/* <Cities />
            <Resources /> */}
                    </div>
                </div>
            </DragToScroll>
        </div>
    </>
};

export default IslandUI;