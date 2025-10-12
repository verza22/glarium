import React from "react";
import { useTranslation } from "react-i18next";

import citizenImg from "../../../assets/img/island/citizen.png";
import workerImg from "../../../assets/img/island/worker.png";
import workerMineImg from "../../../assets/img/island/worker_mine.png";
import woodIcon from "../../../assets/img/icon/icon_wood.png";
import wineIcon from "../../../assets/img/icon/icon_wine.png";
import marbleIcon from "../../../assets/img/icon/icon_marble.png";
import glassIcon from "../../../assets/img/icon/icon_glass.png";
import sulfurIcon from "../../../assets/img/icon/icon_sulfur.png";

interface IslandInfo {
  type: number;
  island_type: number;
}

export interface IslandData {
  info: IslandInfo;
  donations: any[];
}

interface IslandResourcesProps {
  data: IslandData;
}

const IslandResources: React.FC<IslandResourcesProps> = ({ data }) => {
  const { t } = useTranslation();

  const value = 0;
  const max = 100;
  const populationAvailable = 50;

  const getTitle = () => {
    if (data.info.type === 1) return t("modal.donations.forestTitle");
    switch (data.info.island_type) {
      case 1:
        return t("modal.donations.vinesTitle");
      case 2:
        return t("modal.donations.quarryTitle");
      case 3:
        return t("modal.donations.crystalTitle");
      case 4:
        return t("modal.donations.sulfurTitle");
      default:
        return "";
    }
  };

  const getIcon = () => {
    if (data.info.type === 1) return woodIcon;
    switch (data.info.island_type) {
      case 1:
        return wineIcon;
      case 2:
        return marbleIcon;
      case 3:
        return glassIcon;
      case 4:
        return sulfurIcon;
      default:
        return "";
    }
  };

  const getWorkerIcon = () => {
    if (data.info.type === 1) return workerImg;
    return workerMineImg;
  };

  return (
    <div className="p-4">
      <div className="text-justify mb-3">{getTitle()}</div>
      <div className="text-center font-semibold">{t("modal.donations.workers")}</div>

      <div className="flex mt-3">
        <div className="flex-1 flex flex-col items-center">
          <img src={citizenImg} className="mb-2 w-10 h-10" alt="citizen" />
          <div className="text-lg font-bold">{populationAvailable}</div>
        </div>

        <div className="flex-3 flex flex-col ml-4">
          <div className="flex justify-between text-sm mb-3">
            <div>
              <div>{t("modal.donations.income")}:</div>
              <div className="flex items-center">
                100 <img src={sulfurIcon} className="w-4 h-4 ml-1" alt="gold" /> {t("modal.donations.perHour")}
              </div>
            </div>
            <div className="text-right">
              <div>{t("modal.donations.production")}:</div>
              <div className="flex items-center">
                50 <img src={getIcon()} className="w-4 h-4 ml-1" alt="resource" /> {t("modal.donations.perHour")}
              </div>
            </div>
          </div>

          <div className="flex items-center mb-3">
            <div className="w-6 h-6 bg-gray-300 cursor-pointer mr-2"></div>
            {/* <VueSlider
              className="flex-1 h-4"
              min={0}
              max={max}
              value={value}
              renderThumb={(props) => <div {...props} className="bg-yellow-500 w-4 h-4 rounded-full" />}
            /> */}
            <div className="w-6 h-6 bg-gray-300 cursor-pointer ml-2"></div>
          </div>

          <div className="flex justify-center">
            <input
              type="number"
              className="border border-gray-400 rounded w-20 px-2 py-1"
              value={value}
              readOnly
            />
            <button className="ml-3 bg-yellow-500 text-black px-3 py-1 rounded">{t("modal.donations.confirm")}</button>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center">
          <img src={getWorkerIcon()} className="mb-2 w-10 h-10" alt="worker" />
          <div className="text-lg font-bold">{value}</div>
        </div>
      </div>

      <div className="mt-5 text-center font-semibold">{t("modal.donations.islandCities")}</div>
      <div className="mt-2">
        {/* <TableDynamic params={data.donations} /> */}
      </div>
    </div>
  );
};

export default IslandResources;