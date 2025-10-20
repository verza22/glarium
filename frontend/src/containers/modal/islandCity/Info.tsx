import React from "react";
import { useTranslation } from "react-i18next";


interface InfoProps {
    name: string;
    level: number;
    user: string;
}

const Info: React.FC<InfoProps> = ({ name, level, user }) => {
    const { t } = useTranslation();

    return (
        <div className="text-sm leading-tight">
            <div className="flex my-1">
                <div className="flex-1">{t("modal.islandCity.name")}:</div>
                <div className="flex-2">
                    {name} ({level})
                </div>
            </div>

            <div className="flex my-1">
                <div className="flex-1">{t("modal.islandCity.player")}:</div>
                <div className="flex-2">{user}</div>
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