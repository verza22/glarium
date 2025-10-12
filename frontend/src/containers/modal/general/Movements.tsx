import React, { useState } from "react";
import Resources from "./Resources";
import Confirm from "./../../../components/Confirm";
import { useTranslation } from "react-i18next";

import transportImg from "../../../assets/img/icon/movement/1.png";
import attackImg from "../../../assets/img/icon/movement/2.png";
import defenseImg from "../../../assets/img/icon/movement/3.png";
import colonizeImg from "../../../assets/img/icon/movement/4.png";

import magnifyImg from "../../../assets/img/icon/movement/magnifySmall.png";
import abortImg from "../../../assets/img/icon/movement/btn_abort.png";

interface City {
  name: string;
  user: string;
}

interface UnitResources {
  wood: number;
  wine: number;
  marble: number;
  glass: number;
  sulfur: number;
  gold: number;
  units: { unit_id: number; cant: number }[];
}

export interface IMovement {
  id: number;
  movement_type_id: number;
  trade_ship: number;
  city_from: City;
  city_to: City;
  detail?: boolean;
  confirm?: boolean;
  resources: UnitResources;
}

interface MovementsProps {
  movements: IMovement[];
}

const movementTypeMap: Record<number, { img: string; altKey: string }> = {
  1: { img: transportImg, altKey: "transport" },
  2: { img: attackImg, altKey: "attack" },
  3: { img: defenseImg, altKey: "defense" },
  4: { img: colonizeImg, altKey: "colonize" },
};

const Movements: React.FC<MovementsProps> = ({ movements }) => {
  const { t } = useTranslation();

  const [detailMovements, setDetailMovements] = useState<number[]>([]);
  const [confirmMovements, setConfirmMovements] = useState<number[]>([]);

  const toggleDetail = (id: number) => {
    setDetailMovements((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleConfirm = (id: number) => {
    setConfirmMovements((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="p-2 overflow-x-auto">
      <table className="min-w-full text-center border border-gray-300 text-xs">
        <thead className="bg-gray-100">
          <tr>
            <th className="w-16 px-1 py-1">{t("modal.general.mission")}</th>
            <th className="w-28 px-1 py-1">{t("modal.general.schedule")}</th>
            <th className="px-1 py-1">{t("resources.ships")}</th>
            <th className="px-1 py-1"></th>
            <th className="px-1 py-1">{t("modal.general.origin")}</th>
            <th className="px-1 py-1"></th>
            <th className="px-1 py-1">{t("modal.general.destination")}</th>
            <th className="px-1 py-1">{t("modal.general.action")}</th>
          </tr>
        </thead>
        <tbody>
          {movements.map((movement) => {
            const movementData = movementTypeMap[movement.movement_type_id];
            return (
              <tr key={movement.id} className="border-t border-gray-200">
                <td className="p-1">
                  <img
                    src={movementData.img}
                    alt={t(`modal.general.movementType.${movementData.altKey}`)}
                    className="mx-auto w-6 h-6"
                  />
                </td>
                <td className="p-1">
                  {/* Placeholder for schedule */}
                  <div>-</div>
                </td>
                <td className="p-1">
                  {movement.trade_ship} {t("resources.ships")}
                </td>
                <td className="p-1 relative">
                  <img
                    src={magnifyImg}
                    alt={t("modal.general.viewCargo")}
                    className="cursor-pointer mx-auto w-5 h-5"
                    onClick={() => toggleDetail(movement.id)}
                  />
                  {detailMovements.includes(movement.id) && (
                    <Resources
                      movement={movement}
                      close={() => toggleDetail(movement.id)}
                    />
                  )}
                </td>
                <td className="p-1">
                  <div>{movement.city_from.name}</div>
                  <div className="text-gray-500">({movement.city_from.user})</div>
                </td>
                <td className="p-1">
                  {/* Placeholder for arrow */}
                  <div>-</div>
                </td>
                <td className="p-1">
                  <div>{movement.city_to.name}</div>
                  <div className="text-gray-500">({movement.city_to.user})</div>
                </td>
                <td className="p-1 relative">
                  <img
                    src={abortImg}
                    alt={t("modal.general.withdraw")}
                    className="cursor-pointer mx-auto w-5 h-5"
                    onClick={() => toggleConfirm(movement.id)}
                  />
                  {confirmMovements.includes(movement.id) && (
                    <Confirm
                      data={movement}
                      close={() => toggleConfirm(movement.id)}
                      confirm={() => toggleConfirm(movement.id)}
                    />
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Movements;