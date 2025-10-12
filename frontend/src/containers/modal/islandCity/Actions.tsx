import React from "react";
import { useTranslation } from "react-i18next";

import transportImg from "../../../assets/img/island/transport.jpg";
import diplomacyImg from "../../../assets/img/island/diplomacy.jpg";
import defendImg from "../../../assets/img/island/defend.jpg";
import attackImg from "../../../assets/img/island/attack.jpg";

interface CityData {
  city: {
    name: string;
    type?: boolean;
  };
}

interface ActionsProps {
  data: CityData;
  changeType: (type: number) => void;
  hasUnits: boolean;
}

const Actions: React.FC<ActionsProps> = ({ data, changeType, hasUnits }) => {
  const { t } = useTranslation();

  return (
    <div>
      <div className="border-b border-yellow-600 mb-2">
        <div className="text-lg font-bold text-center">{t("modal.islandCity.actions.title")}</div>
      </div>

      <div className="py-2 flex flex-wrap justify-between">
        {!data.city.type && (
          <div className="w-[49%] text-center">
            <div
              className="inline-block p-2 text-sm cursor-pointer"
              title={t("modal.islandCity.actions.diplomacy")}
              onClick={() => changeType(1)}
            >
              <div
                className="w-[50px] h-[34px] mx-auto bg-center bg-no-repeat bg-cover hover:bg-[position:center]"
                style={{ backgroundImage: `url(${diplomacyImg})` }}
              ></div>
              <div className="mt-1">{t("modal.islandCity.actions.diplomacy")}</div>
            </div>
          </div>
        )}

        <div className="w-[49%] text-center">
          <div
            className="inline-block p-2 text-sm cursor-pointer"
            title={t("modal.islandCity.actions.transport")}
            onClick={() => changeType(2)}
          >
            <div
              className="w-[50px] h-[34px] mx-auto bg-center bg-no-repeat bg-cover hover:bg-[position:center]"
              style={{ backgroundImage: `url(${transportImg})` }}
            ></div>
            <div className="mt-1">{t("modal.islandCity.actions.transport")}</div>
          </div>
        </div>

        {!data.city.type && (
          <>
            <div className="w-[49%] text-center">
              <div
                className="inline-block p-2 text-sm cursor-pointer"
                title={t("modal.islandCity.actions.defend")}
                onClick={() => hasUnits && changeType(4)}
              >
                <div
                  className={`w-[50px] h-[34px] mx-auto bg-center bg-no-repeat bg-cover ${
                    hasUnits ? "hover:bg-[position:center]" : "opacity-50"
                  }`}
                  style={{ backgroundImage: `url(${defendImg})` }}
                ></div>
                <div className="mt-1">{t("modal.islandCity.actions.defend")}</div>
              </div>
            </div>

            <div className="w-[49%] text-center">
              <div
                className="inline-block p-2 text-sm cursor-pointer"
                title={t("modal.islandCity.actions.attack")}
                onClick={() => hasUnits && changeType(5)}
              >
                <div
                  className={`w-[50px] h-[34px] mx-auto bg-center bg-no-repeat bg-cover ${
                    hasUnits ? "hover:bg-[position:center]" : "opacity-50"
                  }`}
                  style={{ backgroundImage: `url(${attackImg})` }}
                ></div>
                <div className="mt-1">{t("modal.islandCity.actions.attack")}</div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Actions;