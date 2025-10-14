import React, { useState } from 'react';
import Ground from "./../assets/img/city/ground.png"


import { ResponseBuildings } from '@shared/types/responses';
import BuildingImage from './BuildingImage';

export interface BuildingPosition {
    top: number;
    left: number;
}

interface BuildingProps {
    groundList: BuildingPosition[],
    buildingList: ResponseBuildings[]
}

const Building: React.FC<BuildingProps> = ({ groundList, buildingList }) => {

    const getBuilding = (index: number) => {
        const buildingIndex = buildingList.findIndex(b => b.position === index);
        if (buildingIndex >= 0) {
            return <BuildingImage buildingId={buildingList[buildingIndex].buildingId} />
        } else {
            return <img
                src={Ground}
                style={{ width: '100%', height: '100%' }}
            />
        }
    }

    const getBuildingStyle = (index: number) => {
        const buildingIndex = buildingList.findIndex(b => b.position === index);
        if (buildingIndex >= 0) {
            switch(buildingList[buildingIndex].buildingId){
                default:
                    return { width: 140, height: 125 }
                case 1:
                    return { width: 190, height: 150 }
                case 16:
                    return { width: 143, height: 211 }
                case 17:
                    return { backgroundPositionX: 'center', height: 149, width: 169, position: 'relative', top: -25, left: -7 }
                case 19:
                    return { height: 102, width: 161, backgroundRepeat: 'no-repeat', position: 'relative', top: 6, right: 9 }
            }
        } else {
            return { width: 140, height: 125 }
        }
    }

    return (
        <div className="divBuilds" style={{ position: 'relative', width: '100%', height: '100%' }}>
            {groundList.map((building, index) => (
                <div
                    key={index}
                    className="object"
                    style={{
                        ...getBuildingStyle(index),
                        position: 'absolute',
                        top: building.top,
                        left: building.left
                    }}
                >
                    {getBuilding(index)}
                </div>
            ))}
        </div>
    );
};

export default Building;