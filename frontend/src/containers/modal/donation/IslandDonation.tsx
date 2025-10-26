import React, { ChangeEvent } from "react";
import { useTranslation } from "react-i18next";

import woodImg from "../../../assets/img/island/img_wood.jpg";
import wineImg from "../../../assets/img/island/img_wine.jpg";
import marbleImg from "../../../assets/img/island/img_marble.jpg";
import glassImg from "../../../assets/img/island/img_glass.jpg";
import sulfurImg from "../../../assets/img/island/img_sulfur.jpg";
import iconWoodImg from "../../../assets/img/icon/icon_wood.png";
import { useCityStore } from "../../../store/cityStore";

interface IslandDonationProps {
    data: {
        type: boolean;
        island_type: number;
        level: number;
        required_wood: number;
        donated: number;
        constructed_at: string | null;
    };
    handleSetDonation: (value: number) => void
}

const IslandDonation: React.FC<IslandDonationProps> = ({ data, handleSetDonation }) => {
    const { t } = useTranslation();
    const [value, setValue] = React.useState(0);
    const resources = useCityStore(state=> state.resources);

    const getImage = () => {
        if (data.type) return woodImg;
        switch (data.island_type) {
            case 1:
                return wineImg;
            case 2:
                return marbleImg;
            case 3:
                return glassImg;
            case 4:
                return sulfurImg;
            default:
                return woodImg;
        }
    };

    const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
        let n = Number(e.target.value);
        if (n > data.required_wood) n = data.required_wood;
        if (n > resources.wood) n = resources.wood;
        if (n < 0) n = 0;
        setValue(n);
    }

    const handleMax = () => {
        let n = data.required_wood;
        if (n > resources.wood) n = resources.wood;
        setValue(n);
    }

    return (
        <div className="py-3 box border rounded bg-yellow-100 text-center text-sm">
            <div className="relative mb-4">
                <img src={getImage()} alt={t("resources.wood")} className="w-full rounded" />
                <div className="absolute bottom-0 right-5 flex">
                    <div className="bg-yellow-300 px-3 py-1 m-auto">
                        <div>{t("modal.donations.level")}</div>
                        <div className="text-xl font-bold">{data.level}</div>
                    </div>
                </div>
            </div>

            <div className="mb-2">
                <div className="font-semibold my-2">{t("modal.donations.required_next_level")}</div>
                <div className="flex items-center pl-5 mb-2">
                    <img src={iconWoodImg} alt={t("resources.wood")} className="w-5 h-5" />
                    <div className="ml-2">{data.required_wood}</div>
                </div>

                <div className="font-semibold my-2">{t("modal.donations.existing")}</div>
                <div className="flex items-center pl-5 mb-2">
                    <img src={iconWoodImg} alt={t("resources.wood")} className="w-5 h-5" />
                    <div className="ml-2">{data.donated}</div>
                </div>
            </div>

            {data.constructed_at === null ? (
                <div className="mt-3">
                    <div className="font-semibold">{t("modal.donations.donate")}</div>
                    <div className="mt-2">
                        <input
                            type="number"
                            className="w-1/2 border rounded px-2 py-1 text-sm"
                            placeholder={t("modal.donations.enter_amount")}
                            value={value > 0 ? value : ''}
                            onChange={handleInput}
                        />
                    </div>
                    <div className="mb-3 text-blue-500 cursor-pointer" onClick={handleMax}>{t("modal.donations.max")}</div>
                    <div className="w-3/4 mx-auto py-1 bg-yellow-300 rounded cursor-pointer hover:bg-yellow-400" onClick={()=> handleSetDonation(value)}>
                        {t("modal.donations.confirm")}
                    </div>
                </div>
            ) : (
                <div className="mt-3">
                    <div>{t("modal.donations.under_construction")}</div>
                    <div>{data.constructed_at}</div>
                </div>
            )}
        </div>
    );
};

export default IslandDonation;