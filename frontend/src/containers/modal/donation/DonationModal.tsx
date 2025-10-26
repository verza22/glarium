import React from "react";
import WindowLeft from "../window/WindowLeft";
import WindowRight from "../window/WindowRight";
import IslandResources, { IslandData } from "./IslandResources";
import IslandDonation from "./IslandDonation";
import { useTranslation } from "react-i18next";
import { useIslandGetData } from "../../../hooks/useIslandGetData";
import { useIslandSetWorker } from "../../../hooks/useIslandSetWorket";
import { useIslandSetDonation } from "../../../hooks/useIslandSetDonation";

export interface DonationInfo extends IslandData {
    maxWorkers: number,
    nextWood: number,
    donations: {
        id: number;
        cityId: number;
        donated: number;
        workers?: number;
    }[];
    constructedAt: string | null;
    donated: number;
}

export interface DonationRef {
    setInfo: (info: IslandData) => void;
}

interface DonationProps {
    ref: React.Ref<DonationRef>,
    close: () => void;
}

const Donation: React.FC<DonationProps> = ({ close, ref }) => {
    const { t } = useTranslation();
    const [info, setInfo] = React.useState<DonationInfo | null>(null);
    const { mutate: getIslandData } = useIslandGetData();
    const { mutate: setWorker } = useIslandSetWorker();
    const { mutate: setDonation } = useIslandSetDonation();

    React.useImperativeHandle(ref, () => ({
        setInfo: (info: IslandData) => {
            setInfo(null);
            getIslandData({ islandId: info.info.islandId, type: info.info.type }, {
                onSuccess: (response) => {
                    let donated = 0;

                    response.donations.forEach(x => {
                        donated += x.donated;
                    });

                    setInfo({
                        ...info,
                        ...response
                    });
                }
            });
        }
    }), []);

    if (info === null)
        return null;

    const getTitle = () => {
        if (info.info.type) return t("modal.donations.forestTitle");
        switch (info.info.island_type) {
            case 1:
                return t("modal.donations.vinesTitle");
            case 2:
                return t("modal.donations.quarryTitle");
            case 3:
                return t("modal.donations.crystalTitle");
            case 4:
                return t("modal.donations.sulfurTitle");
            default:
                return "";
        }
    };

    const handleSetWorker = (value: number) => {
        setWorker({ workers: value, type: info.info.type }, { onSuccess: () => close() });
    }

    const handleSetDonation = (value: number) => {
        setDonation({ wood: value, type: info.info.type, islandId: info.info.islandId }, { onSuccess: () => close() });
    }

    return (
        <div className="flex flex-col space-y-4">
            <WindowLeft close={close} title={getTitle()}>
                <IslandResources
                    data={info}
                    donations={info.donations}
                    max={info.maxWorkers}
                    handleSetWorker={handleSetWorker}
                />
            </WindowLeft>

            <WindowRight title={getTitle()}>
                <IslandDonation
                    handleSetDonation={handleSetDonation}
                    data={
                        {
                            type: info.info.type,
                            island_type: info.info.island_type,
                            level: info.info.type ? info.info.levelForest : info.info.levelMine,
                            required_wood: info.nextWood,
                            donated: info.donated,
                            constructed_at: info.constructedAt
                        }
                    }
                />
            </WindowRight>
        </div>
    );
};

export default Donation;