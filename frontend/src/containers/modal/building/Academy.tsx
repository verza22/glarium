import React, { ChangeEvent, useState } from 'react'
import { useTranslation } from 'react-i18next'

import CitizenIcon from '../../../assets/img/island/citizen.png'
import ScientistIcon from '../../../assets/img/icon/scientist.png'
import GoldIcon from '../../../assets/img/icon/icon_gold.png'
import PiIcon from '../../../assets/img/icon/icon_pi.png'
import RangeSlider from '../../../components/RangeSlider'
import { useCityStore } from '../../../store/cityStore'
import { usePopulationAvailable } from '../../../hooks/usePopulationAvailable'

interface AcademyProps {
    scientist: number,
    scientistMax: number,
    handleScients: (scientist: number) => void
}

export default function Academy({ scientist, scientistMax, handleScients }: AcademyProps) {
    const { t } = useTranslation();
    const populationAvailable = usePopulationAvailable();

    const [value, setValue] = useState<number>(scientist);
    const scientistCost = 3;
    const corruption = 0 // TODO

    const income = (populationAvailable * 3) - (value * scientistCost)
    const production = value;// * corruption

    const handleInput = (e:  ChangeEvent<HTMLInputElement>) => {
        let n = Number(e.target.value);
        if(n>scientistMax) n = scientistMax;
        if(n<0) n = 0;
        setValue(n);
    }

    return (
        <div className="bg-white p-4 rounded-md shadow-md mb-3">
            <div className="text-center font-semibold mb-4">{t('modal.building.workers')}</div>
            <div className="flex space-x-4">
                <div className="flex-1 flex flex-col items-center relative">
                    <img src={CitizenIcon} className="mb-2" />
                    <div className="absolute bottom-0 font-bold">{(populationAvailable+scientist) - value}</div>
                </div>

                <div className="flex-3 flex flex-col space-y-4">
                    <div className="flex justify-between text-sm">
                        <div>
                            <div>{t('modal.building.income')}:</div>
                            <div className="flex items-center space-x-1">
                                <span>{income}</span>
                                <img src={GoldIcon} className="w-4 h-4" />
                                <span>{t('modal.building.perHour')}</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <div>{t('modal.building.production')}:</div>
                            <div className="flex items-center space-x-1 justify-end">
                                <span>{production.toFixed(0)}</span>
                                <img src={PiIcon} className="w-4 h-4" />
                                <span>{t('modal.building.perHour')}</span>
                            </div>
                        </div>
                    </div>

                    <RangeSlider
                        value={value}
                        max={scientistMax}
                        min={0}
                        step={1}
                        setValue={(response: number) => setValue(response)}
                    />

                    <div className="flex justify-center space-x-3">
                        <input
                            type="number"
                            value={value}
                            onChange={handleInput}
                            className="w-20 border rounded px-2 py-1 text-center"
                        />
                        <button
                            className="px-3 py-1 bg-indigo-600 text-white rounded"
                            onClick={()=> handleScients(value)}
                        >
                            {t('modal.building.confirm')}
                        </button>
                    </div>
                </div>

                <div className="flex-1 flex flex-col items-center relative">
                    <img src={ScientistIcon} className="mb-2" />
                    <div className="absolute bottom-0 font-bold">{value}</div>
                </div>
            </div>
        </div>
    )
}