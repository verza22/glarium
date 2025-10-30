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
import { useUserSendMessage } from "../../../hooks/useUserSendMessage";

type CityData = {
    cityId: number;
    name: string;
    user: string;
    level: number;
    userId: number;
};

export interface IslandCityInfo {
    city: CityData;
    targetCity: CityData;
}

export interface IslandCityInfoRef {
    setInfo: (info: IslandCityInfo) => void;
}

interface IslandCityModalProps {
    ref: React.Ref<IslandCityInfoRef>,
    close: () => void;
}

const IslandCityModal: React.FC<IslandCityModalProps> = ({ close, ref }) => {
    const { t } = useTranslation();
    const [type, setType] = useState<number>(0);
    const [info, setInfo] = useState<IslandCityInfo | null>(null);
    const { mutate: sendMessage } = useUserSendMessage();

    React.useImperativeHandle(ref, () => ({
        setInfo: (data: IslandCityInfo) => {
            setInfo(data);
        }
    }), []);

    if(info === null)
        return null;

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

    const handleSendMessage = (message: string) => {
        sendMessage({cityId: info.targetCity.cityId, message}, {onSuccess: () => {
            close();
        }});
    }

    return (
        <div className="border border-gray-300 rounded-md p-2">
            {type !== 0 && (
                <WindowLeft title={getTitle()} close={close}>
                    {(type === 1 || type === 3) && <Diplomacy user={info.targetCity.name} handleSendMessage={handleSendMessage} />}
                    {type === 2 && <Transport cityFrom={{ id: info.city.cityId, name: info.city.name }} cityTo={{ id: info.targetCity.cityId, name: info.targetCity.name }} close={close} />}
                    {type === 4 && <Defense />}
                    {type === 5 && <Attack targetCityName={info.targetCity.name} targetCityId={info.targetCity.cityId} changeType={changeType} close={close} />}
                </WindowLeft>
            )}

            {type !== 3 && (
                <WindowRight title={t("modal.islandCity.info")}>
                    <Info name={info.targetCity.name} level={info.targetCity.level} user={info.targetCity.user} />
                    {info.targetCity.cityId !== info.city.cityId && (
                        <Actions data={info} changeType={changeType} hasUnits />
                    )}
                </WindowRight>
            )}
        </div>
    );
};

export default IslandCityModal;