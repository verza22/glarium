import React from "react";
import { useTranslation } from "react-i18next";

interface CityData {
  city: {
    name: string;
    level: number;
    user: string;
  };
}

interface InfoProps {
  data: CityData;
}

const Info: React.FC<InfoProps> = ({ data }) => {
  const { t } = useTranslation();

  return (
    <div className="text-sm leading-tight">
      <div className="flex my-1">
        <div className="flex-1">{t("modal.islandCity.name")}:</div>
        <div className="flex-2">
          {data.city.name} ({data.city.level})
        </div>
      </div>

      <div className="flex my-1">
        <div className="flex-1">{t("modal.islandCity.player")}:</div>
        <div className="flex-2">{data.city.user}</div>
      </div>

      <div className="flex my-1">
        <div className="flex-1">{t("modal.islandCity.alliance")}:</div>
        <div className="flex-2">-</div>
      </div>

      <div className="flex my-1">
        <div className="flex-1">{t("modal.islandCity.points")}:</div>
        <div className="flex-2">-</div>
      </div>
    </div>
  );
};

export default Info;