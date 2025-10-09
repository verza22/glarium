import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import WindowLeft from "./../window/WindowLeft";
import WindowRight from "./../window/WindowRight";
import Categories from "./Categories";
import Research from "./Research";

interface ResearchModalProps {
  close: () => void;
}

const ResearchModal: React.FC<ResearchModalProps> = ({ close }) => {
  const { t } = useTranslation();
  const [category, setCategory] = useState<number>(1);

  const dummyResearch = {
    category: 1,
    researchs: [
      { id: 1, level: 1, cost: 100, finish: false },
      { id: 2, level: 2, cost: 200, finish: true },
      { id: 3, level: 3, cost: 400, finish: false },
    ],
    selected: { id: 2, level: 2, cost: 200, index: 1 },
    total_scientists: 25,
    research_point: 150,
    research_point_hour: 35,
    maxLevel: 2,
    changeResearch: (research: any, index: number) => {
      console.log("Selected research:", research, "at index:", index);
    },
  };

  const changeCategory = (newCategory: number) => {
    setCategory(newCategory);
  };

  return (
    <div className="flex justify-center items-start space-x-4 p-4">
      <WindowLeft title={t("modal.research.windowLeftTitle")} close={close}>
        <Research {...dummyResearch} />
      </WindowLeft>

      <WindowRight title={t("modal.research.windowRightTitle")}>
        <Categories changeCategory={changeCategory} />
      </WindowRight>
    </div>
  );
};

export default ResearchModal;