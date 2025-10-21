import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Import local images
import islandImg from "../assets/img/world/island.png";
import islandActiveImg from "../assets/img/world/island_active.png";
import iconWine from "../assets/img/icon/icon_wine.png";
import iconMarble from "../assets/img/icon/icon_marble.png";
import iconGlass from "../assets/img/icon/icon_glass.png";
import iconSulfur from "../assets/img/icon/icon_sulfur.png";
import { ResponseWorldGetIslands } from "@shared/types/responses";


interface IslandsProps {
    data: ResponseWorldGetIslands[];
    wsize: number;
    hsize: number;
    x: number;
    y: number;
}

// Map resource type to icon
const resourceIcons: Record<number, string> = {
    1: iconWine,
    2: iconMarble,
    3: iconGlass,
    4: iconSulfur,
};

export const WorldIslands: React.FC<IslandsProps> = ({
    data,
    wsize,
    hsize,
    x,
    y,
}) => {
    const navigate = useNavigate();
    const [xActive, setXActive] = useState(0);
    const [yActive, setYActive] = useState(0);

    // Set initial active island coordinates
    useEffect(() => {
        setXActive(x);
        setYActive(y);
    }, [x, y]);

    // Build island title
    const getTitle = (island: ResponseWorldGetIslands) => `${island.name} [${island.x}:${island.y}]`;

    // Return CSS class when island is active
    const checkActive = (island: ResponseWorldGetIslands) =>
        xActive === island.x && yActive === island.y ? "active" : "";

    // Handle island click
    const select = async (island: ResponseWorldGetIslands) => {
        navigate(`/island/${island.id}`);
    };

    return (
        <div className="relative">
            {data.map((island, index) => (
                <div key={index}>
                    {/* Island tile */}
                    <div
                        title={getTitle(island)}
                        onClick={() => select(island)}
                        className={`absolute cursor-pointer transition-all duration-200 ${checkActive(island) ? "active" : ""
                            }`}
                        style={{
                            width: `${wsize}px`,
                            height: `${hsize}px`,
                            top: `${hsize * island.y}px`,
                            left: `${wsize * island.x}px`,
                            backgroundImage: `url(${checkActive(island) ? islandActiveImg : islandImg})`,
                            backgroundSize: "cover",
                        }}
                    >
                        <div className="absolute bottom-5 left-0 right-0 mx-auto w-6 text-center bg-[#FDF7DD] border border-[#E0B018] text-[0.83rem] p-[1px]">
                            {island.cities}
                        </div>

                        <div
                            className="absolute top-[55px] right-[82px] w-[25px] h-[20px] bg-contain bg-no-repeat"
                            style={{
                                backgroundImage: `url(${resourceIcons[island.type]})`,
                            }}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
};