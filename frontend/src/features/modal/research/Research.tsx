import React from "react";
import { useTranslation } from "react-i18next";

import scientistImg from "../../../assets/img/icon/icon_scientist.png";
import piImg from "../../../assets/img/icon/icon_pi.png";
import researchTimeImg from "../../../assets/img/icon/icon_research_time.png";

interface Research {
  id: number;
  level: number;
  cost: number;
  finish?: boolean;
}

interface ResearchProps {
  category: number;
  researchs: Research[];
  selected: Research;
  total_scientists: number;
  research_point: number;
  research_point_hour: number;
  maxLevel: number;
  changeResearch: (r: Research, index: number) => void;
}

const Research: React.FC<ResearchProps> = ({
  category,
  researchs,
  selected,
  total_scientists,
  research_point,
  research_point_hour,
  maxLevel,
  changeResearch,
}) => {
  const { t } = useTranslation();

  return (
    <div className="box text-[0.83rem]">
      <div className="gtitle text-center text-[0.9rem] font-semibold mb-2">
        {t(`general.researchCategories.${category}`)}
      </div>

      <div className="flex justify-between items-center my-3 py-1 px-3 bg-[#dec493] rounded-md">
        <div className="flex items-center flex-1">
          <img src={scientistImg} alt={t("general.scientistAlt")} className="mr-2 w-5 h-5" />
          <span>{t("general.scientists")}: {total_scientists}</span>
        </div>

        <div className="flex items-center justify-center flex-1">
          <img src={piImg} alt={t("general.piAlt")} className="mr-2 w-5 h-5" />
          <span>{t("general.pi")}: {research_point}</span>
        </div>

        <div className="flex items-center justify-end flex-1">
          <img src={researchTimeImg} alt={t("general.researchTimeAlt")} className="mr-2 w-5 h-5" />
          <span>{t("general.perHour")}: {research_point_hour}</span>
        </div>
      </div>

      <div className="flex">
        <div className="flex-1 mr-2 overflow-hidden select-none">
          {researchs.map((r, index) => {
            const isActive = r.id === selected.id;
            const isInactive = r.level > maxLevel + 1;
            return (
              <div
                key={r.id}
                onClick={() => changeResearch(r, index)}
                className={`
                  flex items-center py-1 px-2 cursor-pointer
                  ${isActive ? "bg-[#dec493]" : ""}
                  ${isInactive ? "text-gray-400" : ""}
                  hover:bg-[#dec493] hover:underline
                `}
              >
                <div className="mr-2">{r.level}.</div>
                <div className="whitespace-nowrap">
                  {t(`general.research.${r.id}.name`)}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex-[2] p-2 border border-[#e3c998] rounded-md">
          <div className="gtitle mb-2 font-semibold text-[0.9rem]">
            {t(`general.research.${selected.id}.name`)}
          </div>

          <div className="text text-justify leading-[0.83rem] mb-2">
            {t(`general.research.${selected.id}.text`)}
          </div>

          <div className="flex items-center mt-3">
            <div className="costos mr-2 text-[#542c0f] font-bold">{t("general.cost")}:</div>
            <div className="flex items-center">
              {selected.cost}
              <img src={piImg} alt={t("general.piAlt")} className="ml-1 w-4 h-4" />
            </div>
          </div>

          <div className="text-right mt-3">
            {selected.level > maxLevel + 1 ? (
              <div className="text-red-600">{t("general.previousLevelRequired")}</div>
            ) : selected.finish ? (
              <div>{t("general.finished")}</div>
            ) : research_point >= selected.cost ? (
              <div className="inline-block bg-[#dec493] px-6 py-1 rounded cursor-pointer hover:bg-[#d3b87f] transition">
                {t("general.researchButton")}
              </div>
            ) : (
              <div className="text-red-600">{t("general.notEnoughPoints")}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Research;