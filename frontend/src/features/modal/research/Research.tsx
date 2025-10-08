import React from "react";

import scientistImg from "@/assets/img/icon/icon_scientist.png";
import piImg from "@/assets/img/icon/icon_pi.png";
import researchTimeImg from "@/assets/img/icon/icon_research_time.png";

interface Research {
  id: number;
  level: number;
  cost: number;
  finish?: boolean;
}

interface InvestigacionesProps {
  category: number;
  researchs: Research[];
  selected: Research;
  total_scientists: number;
  research_point: number;
  research_point_hour: number;
  maxLevel: number;
  changeResearch: (r: Research, index: number) => void;
}

const Investigaciones: React.FC<InvestigacionesProps> = ({
  category,
  researchs,
  selected,
  total_scientists,
  research_point,
  research_point_hour,
  maxLevel,
  changeResearch,
}) => {
  return (
    <div className="box text-[0.83rem]">
      {/* Header */}
      <div className="gtitle text-center text-[0.9rem] font-semibold mb-2">
        Area: {/* Replace with translation system later */}
        {`researchCategories[${category}]`}
      </div>

      {/* Resource summary */}
      <div className="flex justify-between items-center my-3 py-1 px-3 bg-[#dec493] rounded-md">
        {/* Scientists */}
        <div className="flex items-center flex-1">
          <img src={scientistImg} alt="scientist" className="mr-2 w-5 h-5" />
          <span>Scientists: {total_scientists}</span>
        </div>

        {/* Research Points */}
        <div className="flex items-center justify-center flex-1">
          <img src={piImg} alt="pi" className="mr-2 w-5 h-5" />
          <span>PI: {research_point}</span>
        </div>

        {/* Research per hour */}
        <div className="flex items-center justify-end flex-1">
          <img
            src={researchTimeImg}
            alt="research time"
            className="mr-2 w-5 h-5"
          />
          <span>Per hour: {research_point_hour}</span>
        </div>
      </div>

      {/* Main content */}
      <div className="flex">
        {/* Research list */}
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
                  {/* Replace with translation later */}
                  {`research[${r.id}].name`}
                </div>
              </div>
            );
          })}
        </div>

        {/* Research detail */}
        <div className="flex-[2] p-2 border border-[#e3c998] rounded-md">
          <div className="gtitle mb-2 font-semibold text-[0.9rem]">
            {/* Replace with translation later */}
            {`research[${selected.id}].name`}
          </div>

          <div className="text text-justify leading-[0.83rem] mb-2">
            {/* Replace with translation later */}
            {`research[${selected.id}].text`}
          </div>

          {/* Cost */}
          <div className="flex items-center mt-3">
            <div className="costos mr-2 text-[#542c0f] font-bold">Cost:</div>
            <div className="flex items-center">
              {selected.cost}
              <img src={piImg} alt="pi" className="ml-1 w-4 h-4" />
            </div>
          </div>

          {/* Action area */}
          <div className="text-right mt-3">
            {selected.level > maxLevel + 1 ? (
              <div className="text-red-600">Previous level required</div>
            ) : selected.finish ? (
              <div>Finished</div>
            ) : research_point >= selected.cost ? (
              <div
                className="
                  inline-block bg-[#dec493] px-6 py-1 rounded
                  cursor-pointer hover:bg-[#d3b87f] transition
                "
              >
                Research
              </div>
            ) : (
              <div className="text-red-600">Not enough points</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Investigaciones;