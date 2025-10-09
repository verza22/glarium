import React from "react";
import WindowLeft from "../window/WindowLeft";
import WindowRight from "../window/WindowRight";
import IslandResources, { IslandData } from "./IslandResources";
import IslandDonation from "./IslandDonation";
import { useTranslation } from "react-i18next";

interface DonacionesProps {
    infop: IslandData;
    close: () => void;
}

const Donaciones: React.FC<DonacionesProps> = ({ infop, close }) => {
    const { t } = useTranslation();
    const [info, setInfo] = React.useState<IslandData>(infop);

    const getTitle = () => {
        if (info.info.type === 1) return t("modal.donations.forest");
        switch (info.info.island_type) {
            case 1:
                return t("modal.donations.vines");
            case 2:
                return t("modal.donations.quarry");
            case 3:
                return t("modal.donations.crystal");
            case 4:
                return t("modal.donations.sulfur");
            default:
                return "";
        }
    };

    React.useEffect(() => {
        setInfo(infop);
    }, [infop]);

    return (
        <div className="flex flex-col space-y-4">
            <WindowLeft close={close} title={getTitle()}>
                <IslandResources data={info} />
            </WindowLeft>

            <WindowRight title={getTitle()}>
                <IslandDonation data={{
                    type: 1,
                    island_type: 2,
                    level: 3,
                    required_wood: 500,
                    donated: 150,
                    constructed_at: null
                }} />
            </WindowRight>
        </div>
    );
};

export default Donaciones;