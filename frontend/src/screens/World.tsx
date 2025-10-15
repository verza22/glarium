import React from "react";
import DragToScroll from "../containers/DragToScroll";
import OceanImg from "../assets/img/world/ocean.png";
import Layout from "../containers/Layout";
import { useWorldGetIslands } from "../hooks/useWorldGetIslands";
import { useUserStore } from "../store/userStore";
import { WorldIslands } from "../components/WorldIsland";

const WorldUI: React.FC = () => {

    const { islandX, islandY } = useUserStore();
    const { data } = useWorldGetIslands(islandX, islandY);
    const wSize = React.useRef(238);
    const hSize = React.useRef(120);

    return <>
        <Layout />
        <div className="cursor-grab h-full w-full absolute overflow-hidden">
            <DragToScroll className="scroll-container" x={wSize.current*islandX} y={hSize.current*islandY}>
                <div
                    className="absolute w-[100000px] h-[100000px] bg-cover bg-no-repeat"
                    style={{ backgroundImage: `url(${OceanImg})` }}
                >
                </div>
                {
                    data &&
                    <WorldIslands
                        data={data}
                        wsize={wSize.current}
                        hsize={hSize.current}
                        x={islandX}
                        y={islandY}
                    />
                }
            </DragToScroll>
        </div>
    </>
};

export default WorldUI;