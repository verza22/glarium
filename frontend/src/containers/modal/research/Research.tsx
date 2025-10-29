import React from "react";
import { useTranslation } from "react-i18next";

import scientistImg from "../../../assets/img/icon/icon_scientist.png";
import piImg from "../../../assets/img/icon/icon_pi.png";
import researchTimeImg from "../../../assets/img/icon/icon_research_time.png";
import { IResearch } from "@shared/types/responses";

interface ResearchProps {
    categoryId: number;
    researchList: IResearch[];
    userResearch: number[];
    totalScientists: number;
    researchPoint: number;
    researchPointHour: number;
    handleResearch: (researchId: number) => void
}

const Research: React.FC<ResearchProps> = ({
    categoryId,
    researchList,
    userResearch,
    totalScientists,
    researchPoint,
    researchPointHour,
    handleResearch
}) => {
    const { t } = useTranslation();
    const researchFiltered = researchList.filter(r => r.categoryId === categoryId);
    let firstResearchFiltered = researchFiltered.filter(r => !userResearch.includes(r.id))[0];
    firstResearchFiltered = typeof firstResearchFiltered === "undefined" ? researchFiltered[researchFiltered.length-1] : firstResearchFiltered;

    const getSelectedResearch = () => {
        return userResearch.length === 0 ? researchFiltered[0] : firstResearchFiltered;
    }

    const [selected, setSelected] = React.useState(getSelectedResearch());

    const changeResearch = (index: number) => {
        setSelected(researchFiltered[index]);
    }

    React.useEffect(()=>{
        setSelected(getSelectedResearch());
    }, [categoryId, userResearch])

    return (
        <div className="box text-[0.83rem]">
            <div className="gtitle text-center text-[0.9rem] font-semibold mb-2">
                {t(`researchCategories.${categoryId}`)}
            </div>

            <div className="flex justify-between items-center my-3 py-1 px-3 bg-[#dec493] rounded-md">
                <div className="flex items-center flex-1">
                    <img src={scientistImg} alt={t("modal.research.scientistAlt")} className="mr-2 w-5 h-5" />
                    <span>{t("modal.research.scientists")}: {totalScientists}</span>
                </div>

                <div className="flex items-center justify-center flex-1">
                    <img src={piImg} alt={t("modal.research.piAlt")} className="mr-2 w-5 h-5" />
                    <span>{t("modal.research.pi")}: {Math.floor(researchPoint).toFixed(0)}</span>
                </div>

                <div className="flex items-center justify-end flex-1">
                    <img src={researchTimeImg} alt={t("modal.research.researchTimeAlt")} className="mr-2 w-5 h-5" />
                    <span>{t("modal.research.perHour")}: {researchPointHour}</span>
                </div>
            </div>

            <div className="flex">
                <div className="flex-1 mr-2 overflow-hidden select-none">
                    {researchFiltered.map((r, index) => {
                        const isActive = userResearch.includes(r.id) || index === 0 || r.id === firstResearchFiltered.id;
                        return (
                            <div
                                key={r.id}
                                onClick={() => changeResearch(index)}
                                className={`
                  flex items-center py-1 px-2 cursor-pointer
                  ${isActive ? "bg-[#dec493]" : ""}
                  ${!isActive ? "text-gray-400" : ""}
                  hover:bg-[#dec493] hover:underline
                `}
                            >
                                <div className="mr-2">{r.level}.</div>
                                <div className="whitespace-nowrap">
                                    {t(`research.${r.id}.name`)}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="flex-[2] p-2 border border-[#e3c998] rounded-md">
                    <div className="gtitle mb-2 font-semibold text-[0.9rem]">
                        {t(`research.${selected.id}.name`)}
                    </div>

                    <div className="text text-justify leading-[0.83rem] mb-2">
                        {t(`research.${selected.id}.text`)}
                    </div>

                    <div className="flex items-center mt-3">
                        <div className="costos mr-2 text-[#542c0f] font-bold">{t("modal.research.cost")}:</div>
                        <div className="flex items-center">
                            {selected.cost}
                            <img src={piImg} alt={t("modal.research.piAlt")} className="ml-1 w-4 h-4" />
                        </div>
                    </div>

                    <div className="text-right mt-3">
                        {selected.level > firstResearchFiltered.level ? (
                            <div className="text-red-600">{t("modal.research.previousLevelRequired")}</div>
                        ) : researchPoint >= selected.cost ? (
                            <div className="inline-block bg-[#dec493] px-6 py-1 rounded cursor-pointer hover:bg-[#d3b87f] transition" onClick={()=> handleResearch(selected.id)}>
                                {t("modal.research.researchButton")}
                            </div>
                        ) : (
                            <div className="text-red-600">{t("modal.research.notEnoughPoints")}</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Research;