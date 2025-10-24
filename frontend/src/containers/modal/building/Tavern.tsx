import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import wineImg from '../../../assets/img/icon/wine-big.png'
import happyImg from '../../../assets/img/icon/happy.png'
import btnMin from '../../../assets/img/icon/btn_min.png'
import btnMax from '../../../assets/img/icon/btn_max.png'

import RangeSlider from '../../../components/RangeSlider'
import { useUserStore } from '../../../store/userStore'

interface TavernProps {
    level: number,
    tavernWine: number,
    tavernWineMax: number,
    handleTavern: (wine: number) => void
}

export default function Tavern({
    level,
    tavernWine,
    tavernWineMax,
    handleTavern
}: TavernProps) {
    const { t } = useTranslation();
    const worldConfig = useUserStore(state=> state.worldConfig);

    const bonusTavern = worldConfig.bonus.tavern;
    const bonusTavernConsume = worldConfig.bonus.tavern_consume;

    const [value, setValue] = useState<number>(tavernWine)

    const satisfiedCitizens = Math.round(((value / bonusTavernConsume) / 12) * bonusTavern * 60)

    return (
        <div className="text-sm leading-snug mb-3">
            <div className="text-center font-semibold mb-2">{t('modal.building.tavern.title')}</div>
            <div className="text-justify w-3/4 mx-auto mb-3">
                {t('modal.building.tavern.description')}
            </div>

            <div className="flex mt-3">
                <div className="flex-1 flex justify-center items-start">
                    <img className="mb-2" src={wineImg} alt="wine" />
                </div>

                <div className="flex-3">
                    <div className="flex text-right mb-3">
                        <div className="flex-1">
                            +{satisfiedCitizens} {t('modal.building.tavern.citizensSatisfied')}
                        </div>
                    </div>

                    <RangeSlider
                        value={value}
                        max={tavernWineMax}
                        min={0}
                        step={12}
                        setValue={(response:number) => setValue(response)}
                    />

                    <div className="flex justify-center mt-3">
                        <select
                            className="border px-2 py-1 w-24"
                            value={value}
                            onChange={(e) => setValue(Number(e.target.value))}
                        >
                            <option value={0}>{t('modal.building.tavern.noWine')}</option>
                            {Array.from({ length: level }, (_, i) => (
                                <option key={i} value={(i + 1) * 12}>
                                    {(i + 1) * 12} {t('modal.building.tavern.winePerHour')}
                                </option>
                            ))}
                        </select>
                        <button
                            className="ml-3 px-3 py-1 bg-blue-500 text-white rounded"
                            onClick={()=> handleTavern(value)}
                        >
                            {t('modal.building.confirm')}
                        </button>
                    </div>
                </div>

                <div className="flex-1 flex justify-center items-start">
                    <img className="mb-2" src={happyImg} alt="happy" />
                </div>
            </div>
        </div>
    )
}