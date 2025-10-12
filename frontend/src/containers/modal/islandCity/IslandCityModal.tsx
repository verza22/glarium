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


interface IslandCityModalProps {
  info: any;
  onClose: () => void;
}

const IslandCityModal: React.FC<IslandCityModalProps> = ({ info, onClose }) => {
  const { t } = useTranslation();
  const [type, setType] = useState<number>(0);

  const changeType = (newType: number) => {
    setType(newType);
    if (newType === 0) onClose();
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
        <WindowLeft title={getTitle()} close={onClose}>
          {(type === 1 || type === 3) && <Diplomacy data={info} changeType={changeType} />}
          {type === 2 && <Transport cityFrom={{id:1,name:"a"}} cityTo={{id:2,name:"b"}} />}
          {type === 4 && <Defense  />}
          {type === 5 && <Attack data={info} changeType={changeType} />}
        </WindowLeft>
      )}

      {type !== 3 && (
        <WindowRight title={t("modal.islandCity.info")}>
          <Info data={info} />
          {cityId !== info.city.city_id && (
            <Actions data={info} changeType={changeType} hasUnits />
          )}
        </WindowRight>
      )}
    </div>
  );
};

export default IslandCityModal;