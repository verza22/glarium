import React from "react";
import { useTranslation } from "react-i18next";

import shipImg from "../../../assets/img/icon/ship_transport.png";
import woodImg from "../../../assets/img/icon/icon_wood.png";
import wineImg from "../../../assets/img/icon/icon_wine.png";
import marbleImg from "../../../assets/img/icon/icon_marble.png";
import glassImg from "../../../assets/img/icon/icon_glass.png";
import sulfurImg from "../../../assets/img/icon/icon_sulfur.png";
import goldImg from "../../../assets/img/icon/icon_gold.png";

interface Unit {
  unit_id: number;
  cant: number;
}

interface ResourcesProps {
  movement: {
    trade_ship: number;
    resources: {
      wood: number;
      wine: number;
      marble: number;
      glass: number;
      sulfur: number;
      gold: number;
      units: Unit[];
    };
  };
  close: () => void;
}

const Resources: React.FC<ResourcesProps> = ({ movement, close }) => {
  const { t } = useTranslation();

  const renderResource = (amount: number, imgSrc: string, altKey: string) => {
    if (amount > 0) {
      return (
        <div className="flex flex-col items-center px-2 mb-2">
          <div className="flex items-center justify-center mb-1">
            <img src={imgSrc} alt={t(`resources.${altKey}`)} className="w-6 h-6" />
          </div>
          <div>{amount}</div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="absolute left-8 top-0 bottom-0 flex items-center">
      <div className="bg-[#FAE0AE] border border-[#E4B873] text-[#906646] p-2">
        <div className="flex items-center mb-2">
          <div className="flex-1 mr-2 font-semibold">{t("text.shipment")}</div>
          <button onClick={close} className="text-[#906646] font-bold px-2">
            ✕
          </button>
        </div>

        <div className="flex flex-wrap items-center">
          <div className="flex flex-col items-center px-2 mb-2">
            <img src={shipImg} alt={t("resources.ships")} className="w-10 mb-1" />
            <div>{movement.trade_ship}</div>
          </div>

          {renderResource(movement.resources.wood, woodImg, "wood")}
          {renderResource(movement.resources.wine, wineImg, "wine")}
          {renderResource(movement.resources.marble, marbleImg, "marble")}
          {renderResource(movement.resources.glass, glassImg, "glass")}
          {renderResource(movement.resources.sulfur, sulfurImg, "sulfur")}
          {renderResource(movement.resources.gold, goldImg, "gold")}

          {movement.resources.units.map((unit, i) =>
            unit.cant > 0 ? (
              <div key={i} className="flex flex-col items-center px-2 mb-2">
                <div
                  className={`my-1 w-6 h-6 bg-[url('/src/assets/img/units/unit_${unit.unit_id}.png')] bg-contain bg-no-repeat`}
                />
                <div>{unit.cant}</div>
              </div>
            ) : null
          )}
        </div>
      </div>
    </div>
  );
};

export default Resources;