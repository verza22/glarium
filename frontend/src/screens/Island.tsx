import React from "react";
import DragToScroll from "../containers/DragToScroll";

import OceanImg from "../assets/img/island/ocean.jpg";
import IslandImg from "../assets/img/island/0.jpg";
import Layout from "../containers/Layout";
import { useParams } from "react-router-dom";
import { useIslandGetInfo } from "../hooks/useIslandGetInfo";
import IslandCities from "../components/IslandCities";
import IslandResources from "../components/IslandResources";

const IslandUI: React.FC = () => {

    const { islandId } = useParams<{ islandId: string }>();
    const { data } = useIslandGetInfo(Number(islandId));

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
                        {
                            data && <>
                                <IslandCities 
                                    id={data.id}
                                    name={data.name}
                                    x={data.x}
                                    y={data.y}
                                    cities={data.cities}
                                />
                                <IslandResources
                                    type={data.type}
                                    islandId={data.id}
                                    levelForest={data.levelForest}
                                    levelMine={data.levelMine}
                                />
                            </>
                        }
                    </div>
                </div>
            </DragToScroll>
        </div>
    </>
};

export default IslandUI;