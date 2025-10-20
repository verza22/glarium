import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import WindowLeft from "./../window/WindowLeft";
import WindowRight from "./../window/WindowRight";
import Info from "./Info";
import Actions from "./Actions";
import Diplomacy from "./Options/Diplomacy";
import Transport from "./Options/Transport";
import Defense from "./Options/Defense";
import Attack from "./Options/Attack";

type CityData = {
    city_id: number;
    name: string;
    owner: string;
    population?: number;
    coordinates?: {
        x: number;
        y: number;
    };
};

type ResourceData = {
    wood: number;
    wine: number;
    marble: number;
    glass: number;
    sulfur: number;
};

interface IslandCityInfo {
    type?: number;
    city: CityData;
    target_city: CityData;
    resources?: ResourceData;
    hasUnits?: boolean;
    island_name?: string;
    player_name?: string;
}

interface IslandCityModalProps {
    close: () => void;
}

const IslandCityModal: React.FC<IslandCityModalProps> = ({ close }) => {
    const { t } = useTranslation();
    const [type, setType] = useState<number>(0);
    const info: IslandCityInfo = {
        type: 2, // por ejemplo: transporte de recursos
        city: {
            city_id: 1,
            name: "Atenas",
            owner: "Luis Zurita",
            population: 3200,
            coordinates: { x: 45, y: 62 },
        },
        target_city: {
            city_id: 2,
            name: "Esparta",
            owner: "Mario Pérez",
            population: 2900,
            coordinates: { x: 50, y: 67 },
        },
        resources: {
            wood: 1200,
            wine: 300,
            marble: 150,
            glass: 50,
            sulfur: 20,
        },
        island_name: "Isla de Egeo",
        player_name: "Luis Zurita",
        hasUnits: true,
    };

    const changeType = (newType: number) => {
        setType(newType);
        if (newType === 0) close();
    };

    const getTitle = () => {
        switch (type) {
            case 1:
                return t("modal.islandCity.writeMessage");
            case 2:
                return t("modal.islandCity.transportResources");
            case 5:
                return t("modal.islandCity.attack");
            default:
                return "";
        }
    };

    useEffect(() => {
        if (info.type !== undefined) setType(info.type);
    }, [info.type]);

    const cityId = info.city.city_id;

    return (
        <div className="border border-gray-300 rounded-md p-2">
            {type !== 0 && (
                <WindowLeft title={getTitle()} close={close}>
                    {(type === 1 || type === 3) && <Diplomacy user={info.target_city.name} cityId={info.target_city.city_id} changeType={changeType} />}
                    {type === 2 && <Transport cityFrom={{ id: 1, name: "a" }} cityTo={{ id: 2, name: "b" }} />}
                    {type === 4 && <Defense />}
                    {type === 5 && <Attack data={info} changeType={changeType} />}
                </WindowLeft>
            )}

            {type !== 3 && (
                <WindowRight title={t("modal.islandCity.info")}>
                    <Info name={info.city.name} level={1} user={info.city.owner} />
                    {cityId !== info.city.city_id && (
                        <Actions data={info} changeType={changeType} hasUnits />
                    )}
                </WindowRight>
            )}
        </div>
    );
};

export default IslandCityModal;