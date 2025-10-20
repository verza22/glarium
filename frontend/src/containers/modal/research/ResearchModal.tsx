import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import WindowLeft from "./../window/WindowLeft";
import WindowRight from "./../window/WindowRight";
import Categories from "./Categories";
import Research from "./Research";
import { useResearchData } from "../../../hooks/useResearchData";
import { useResearchCreate } from "../../../hooks/useResearchCreate";
import { useQueryClient } from "@tanstack/react-query";

interface ResearchModalProps {
    close: () => void;
}

const ResearchModal: React.FC<ResearchModalProps> = ({ close }) => {
    const { t } = useTranslation();
    const [categoryId, setCategoryId] = useState<number>(1);
    const { data } = useResearchData();
    const queryClient = useQueryClient();
    const { mutate: research } = useResearchCreate();

    if (!data)
        return null;

    const changeCategory = (newCategoryId: number) => {
        setCategoryId(newCategoryId);
    };

    const handleResearch = (researchId: number) => {
        research({ researchId }, {
            onSuccess: (res) => {
                if (res === "ok")
                    queryClient.invalidateQueries({ queryKey: ['researchData'] });
            }
        });
    }

    return (
        <>
            <WindowLeft title={t("modal.research.windowLeftTitle")} close={close}>
                <Research
                    categoryId={categoryId}
                    researchList={data.researchList}
                    userResearch={data.userResearch}
                    totalScientists={data.totalScientists}
                    researchPoint={data.researchPoint}
                    researchPointHour={data.researchPointHour}
                    handleResearch={handleResearch}
                />
            </WindowLeft>

            <WindowRight title={t("modal.research.windowRightTitle")}>
                <Categories changeCategory={changeCategory} />
            </WindowRight>
        </>
    );
};

export default ResearchModal;