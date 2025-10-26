import React, { ChangeEvent } from "react";
import { useTranslation } from "react-i18next";

import citizenImg from "../../../assets/img/island/citizen.png";
import workerImg from "../../../assets/img/island/worker.png";
import workerMineImg from "../../../assets/img/island/worker_mine.png";
import woodIcon from "../../../assets/img/icon/icon_wood.png";
import wineIcon from "../../../assets/img/icon/icon_wine.png";
import marbleIcon from "../../../assets/img/icon/icon_marble.png";
import glassIcon from "../../../assets/img/icon/icon_glass.png";
import sulfurIcon from "../../../assets/img/icon/icon_sulfur.png";
import goldIcon from "../../../assets/img/icon/icon_gold.png";
import { usePopulationAvailable } from "../../../hooks/usePopulationAvailable";
import { useCityStore } from "../../../store/cityStore";
import RangeSlider from "../../../components/RangeSlider";
import { useUserStore } from "../../../store/userStore";

interface IslandInfo {
    type: boolean;
    island_type: number;
    levelForest: number;
    levelMine: number;
    islandId: number;
    cities: {
        user: string;
        cityId: number;
        name: string;
    }[]
}

export interface IslandData {
    info: IslandInfo;
}

interface IslandResourcesProps {
    data: IslandData;
    donations: {
        id: number;
        cityId: number;
        donated: number;
        workers?: number;
    }[];
    max: number;
    handleSetWorker: (value: number) => void
}

const IslandResources: React.FC<IslandResourcesProps> = ({ data, donations, max: maxProp, handleSetWorker }) => {
    const { t } = useTranslation();

    const populationAvailable = usePopulationAvailable();
    const population = useCityStore(state => state.population);
    const workers = data.info.type ? population.workerForest : population.workerMine;
    const worldConfig = useUserStore(state => state.worldConfig);
    const [value, setValue] = React.useState(workers);

    const citizen = (populationAvailable + workers) - value;

    const max = (populationAvailable + workers) < maxProp ? (populationAvailable + workers) : maxProp;

    const getTitle = () => {
        if (data.info.type) return t("modal.donations.forestTitle");
        switch (data.info.island_type) {
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

    const getIcon = () => {
        if (data.info.type) return woodIcon;
        switch (data.info.island_type) {
            case 1:
                return wineIcon;
            case 2:
                return marbleIcon;
            case 3:
                return glassIcon;
            case 4:
                return sulfurIcon;
            default:
                return "";
        }
    };

    const getWorkerIcon = () => {
        if (data.info.type) return workerImg;
        return workerMineImg;
    };

    const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
        let n = Number(e.target.value);
        if (n > max) n = max;
        if (n < 0) n = 0;
        setValue(n);
    }

    return (
        <div className="p-4">
            <div className="text-justify mb-3">{getTitle()}</div>
            <div className="text-center font-semibold">{t("modal.donations.workers")}</div>

            <div className="flex mt-3">
                <div className="flex-1 flex flex-col items-center">
                    <img src={citizenImg} className="mb-2 w-5 h-10" alt="citizen" />
                    <div className="text-lg font-bold">{citizen}</div>
                </div>

                <div className="flex-3 flex flex-col ml-4">
                    <div className="flex justify-between text-sm mb-3">
                        <div>
                            <div>{t("modal.donations.income")}:</div>
                            <div className="flex items-center">
                                {citizen * 3} <img src={goldIcon} className="w-4 h-4 ml-1" alt="gold" /> {t("modal.donations.perHour")}
                            </div>
                        </div>
                        <div className="text-right">
                            <div>{t("modal.donations.production")}:</div>
                            <div className="flex items-center">
                                {value * worldConfig.bonus.resources} <img src={getIcon()} className="w-4 h-4 ml-1" alt="resource" /> {t("modal.donations.perHour")}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center mb-3">
                        <RangeSlider
                            value={value}
                            max={max}
                            min={0}
                            step={1}
                            setValue={(response: number) => setValue(response)}
                        />
                    </div>

                    <div className="flex justify-center">
                        <input
                            type="number"
                            className="border border-gray-400 rounded w-20 px-2 py-1"
                            value={value}
                            onChange={handleInput}
                        />
                        <button className="ml-3 bg-yellow-500 text-black px-3 py-1 rounded" onClick={() => handleSetWorker(value)}>{t("modal.donations.confirm")}</button>
                    </div>
                </div>

                <div className="flex-1 flex flex-col items-center">
                    <img src={getWorkerIcon()} className="mb-2 w-7 h-10" alt="worker" />
                    <div className="text-lg font-bold">{value}</div>
                </div>
            </div>

            <div className="mt-5 text-center font-semibold">{t("modal.donations.islandCities")}</div>
            <div className="mt-2">
                <table className="min-w-full border border-gray-300 rounded-xl shadow-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-2 text-left text-gray-700 font-semibold">City</th>
                            <th className="px-4 py-2 text-left text-gray-700 font-semibold">User</th>
                            <th className="px-4 py-2 text-left text-gray-700 font-semibold">Donated</th>
                            <th className="px-4 py-2 text-left text-gray-700 font-semibold">Workers</th>
                        </tr>
                    </thead>
                    <tbody>
                        {donations.map((donation) => {
                            const city = data.info.cities.find((c) => c.cityId === donation.cityId);

                            return (
                                <tr key={donation.id} className="border-t hover:bg-gray-50">
                                    <td className="px-4 py-2">{city?.name ?? "Unknown"}</td>
                                    <td className="px-4 py-2">{city?.user ?? "-"}</td>
                                    <td className="px-4 py-2">{donation.donated}</td>
                                    <td className="px-4 py-2">{donation.workers ?? "-"}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default IslandResources;