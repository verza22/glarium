import React from "react";
import { useTranslation } from "react-i18next";

import forest from "../assets/img/island/forest.png";
import forestActive from "../assets/img/island/forest_active.png";
import resource1 from "../assets/img/island/resource_1.png";
import resource1Active from "../assets/img/island/resource_1_active.png";
import resource2 from "../assets/img/island/resource_2.png";
import resource2Active from "../assets/img/island/resource_2_active.png";
import resource3 from "../assets/img/island/resource_3.png";
import resource3Active from "../assets/img/island/resource_3_active.png";
import resource4 from "../assets/img/island/resource_4.png";
import resource4Active from "../assets/img/island/resource_4_active.png";

interface IslandResourcesProps {
  islandId: number;
  levelForest: number;
  levelMine: number;
  type: number;
  handleDonationModal: (type: boolean) => void
}

const IslandResources: React.FC<IslandResourcesProps> = ({
  islandId,
  levelForest,
  levelMine,
  type,
  handleDonationModal
}) => {
  const { t } = useTranslation();

  const mineTitle = (type: number): string => {
    let title = "";
    switch (type) {
      case 1:
        title += t("modal.donations.vinesTitle");
        break;
      case 2:
        title += t("modal.donations.quarryTitle");
        break;
      case 3:
        title += t("modal.donations.crystalTitle");
        break;
      case 4:
        title += t("modal.donations.sulfurTitle");
        break;
      default:
        title += t("modal.donations.vinesTitle");
    }
    title += " " + levelMine;
    return title;
  };

  const mineImages = [
    { normal: resource1, active: resource1Active },
    { normal: resource2, active: resource2Active },
    { normal: resource3, active: resource3Active },
    { normal: resource4, active: resource4Active },
  ];

  const currentMine =
    mineImages[type - 1] || { normal: resource1, active: resource1Active };

  return (
    <div>
      <div
        className="absolute top-[460px] right-[475px] w-[98px] h-[74px] cursor-pointer"
        title={`${t("modal.donations.forestTitle")} ${levelForest}`}
        onClick={() => handleDonationModal(true)}
      >
        <div className="relative group">
          <img src={forest} alt="forest" className="w-[98px] h-[74px]" />
          <img
            src={forestActive}
            alt="forest_active"
            className="w-[103px] h-[74px] absolute top-[-6px] right-[-4px] hidden group-hover:block"
          />
        </div>
      </div>

      <div
        className="absolute top-[486px] right-[648px] cursor-pointer group"
        title={mineTitle(type)}
        onClick={() => handleDonationModal(false)}
      >
        <img
          src={currentMine.normal}
          alt={`mine_${type}`}
          className="transition-opacity"
        />
        <img
          src={currentMine.active}
          alt={`mine_${type}_active`}
          className="absolute top-0 left-0 hidden group-hover:block"
        />
      </div>
    </div>
  );
};

export default IslandResources;