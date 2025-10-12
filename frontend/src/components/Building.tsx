import React, { useState } from 'react';
import Ground from "./../assets/img/city/ground.png"

export interface BuildingPosition {
    top: number;
    left: number;
}

interface BuildingProps {
    buildingList: BuildingPosition[]
}

const Building: React.FC<BuildingProps> = ({ buildingList }) => {


    return (
        <div className="divBuilds" style={{ position: 'relative', width: '100%', height: '100%' }}>
            {buildingList.map((building, i) => (
                <div
                    key={i}
                    className="object"
                    style={{
                        position: 'absolute',
                        top: building.top,
                        left: building.left,
                        width: 140,
                        height: 125,
                    }}
                >
                    <img
                        src={Ground}
                        style={{ width: '100%', height: '100%' }}
                    />
                </div>
            ))}
        </div>
    );
};

export default Building;