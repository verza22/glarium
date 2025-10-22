import React, { useEffect, useState } from "react";
import Ground from "./../assets/img/city/ground.png";
import Construct from "./../assets/img/city/construct.png";
import { ResponseBuildingGetInfo } from "@shared/types/responses";
import BuildingImage from "./BuildingImage";
import { getRemainingTime } from "../utils/util";

export interface BuildingPosition {
    top: number;
    left: number;
}

interface BuildingProps {
    groundList: BuildingPosition[];
    buildingList: ResponseBuildingGetInfo[];
    handleBuilding: (building: ResponseBuildingGetInfo | null, position: number) => void;
}

const Building: React.FC<BuildingProps> = ({ groundList, buildingList, handleBuilding }) => {
    const [currentTime, setCurrentTime] = useState(Date.now());

    useEffect(() => {
        const hasConstruction = buildingList.some(
            (b) => b.constructedAt !== null && new Date(b.constructedAt).getTime() > Date.now()
        );

        if (!hasConstruction) return;

        const interval = setInterval(() => setCurrentTime(Date.now()), 1000);
        return () => clearInterval(interval);
    }, [buildingList]);

    const onClick = (index: number) => {
        const building = buildingList.find((b) => b.position === index);
        handleBuilding(building ?? null, index);
    };

    const getBuildingContent = (index: number) => {
        const building = buildingList.find((b) => b.position === index);

        if (!building) {
            return <img src={Ground} className="w-full h-full" />;
        }

        const isConstruction = building.constructedAt !== null && new Date(building.constructedAt).getTime() > currentTime;

        if (isConstruction) {
            return (
                <div className="relative w-full h-full">
                    <img src={Construct} className="w-full h-full" />
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs px-2 py-1 rounded-md">
                        {building.constructedAt && getRemainingTime(building.constructedAt)}
                    </div>
                </div>
            );
        }

        return <BuildingImage buildingId={building.buildingId} />;
    };

    const getBuildingStyle = (index: number) => {
        const building = buildingList.find((b) => b.position === index);
        if (!building) return { width: 140, height: 125 };

        switch (building.buildingId) {
            default:
                return { width: 140, height: 125 };
            case 1:
                return { width: 190, height: 150 };
            case 16:
                return { width: 215, height: 150 };
            case 17:
                return { height: 149, width: 169, position: "relative", top: -25, left: -7 };
            case 19:
                return { height: 102, width: 161, position: "relative", top: 6, right: 9 };
        }
    };

    return (
        <div className="relative w-full h-full">
            {groundList.map((building, index) => (
                <div
                    key={index}
                    className="absolute cursor-pointer"
                    style={{
                        ...getBuildingStyle(index),
                        top: building.top,
                        left: building.left,
                        position: "absolute"
                    }}
                    onClick={() => onClick(index)}
                >
                    {getBuildingContent(index)}
                </div>
            ))}
        </div>
    );
};

export default Building;