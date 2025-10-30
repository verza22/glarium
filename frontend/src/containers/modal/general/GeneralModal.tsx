import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import WindowLeft from "../window/WindowLeft";
import Movements, { IMovement } from "./Movements";

import closedImg from "../../../assets/img/icon/schriftrolle_closed.png";
import openImg from "../../../assets/img/icon/schriftrolle_offen.png";
import { useGetMovements } from "../../../hooks/useGetMovements";

interface GeneralModalProps {
    close: () => void;
}

const GeneralModal: React.FC<GeneralModalProps> = ({ close }) => {
    const { t } = useTranslation();
    const [type, setType] = useState<number>(0);
    const { data } = useGetMovements();

    if (!data)
        return null;

    const change = (newType: number) => setType(newType);

    return (
        <div className="mBorder">
            <WindowLeft close={close} title={t("modal.general.militia")}>
                <div className="box text-[0.83rem] leading-[0.83rem]">
                    <div className="flex mb-2">
                        <div
                            className={`flex-1 flex justify-center items-center py-1 cursor-pointer ${type === 0 ? "bg-[#dfc594]" : ""
                                }`}
                            title={t("modal.general.receivedMessages")}
                            onClick={() => change(0)}
                        >
                            <div
                                className="w-[17px] h-[17px] bg-center bg-no-repeat inline-block mr-1"
                                style={{
                                    backgroundImage: `url(${type === 0 ? openImg : closedImg
                                        })`,
                                }}
                            />
                            <div>
                                {t("modal.general.movements", { count: data.length })}
                            </div>
                        </div>

                        <div
                            className={`flex-1 flex justify-center items-center py-1 cursor-pointer ${type === 1 ? "bg-[#dfc594]" : ""
                                }`}
                            title={t("modal.general.sentReports")}
                            onClick={() => change(1)}
                        >
                            <div
                                className="w-[17px] h-[17px] bg-center bg-no-repeat inline-block mr-1"
                                style={{
                                    backgroundImage: `url(${type === 1 ? openImg : closedImg
                                        })`,
                                }}
                            />
                            <div>{t("modal.general.warReports", { count: 0 })}</div>
                        </div>
                    </div>

                    {data.length > 0 ? (
                        <Movements movements={data} close={close} />
                    ) : (
                        <div className="text-center my-5">
                            {t("modal.general.noMovements")}
                        </div>
                    )}
                </div>
            </WindowLeft>
        </div>
    );
};

export default GeneralModal;