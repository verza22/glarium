import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import lightGreenImg from '../../../assets/img/icon/lightgreen.png'
// import brownImg from '../../../assets/img/icon/'

interface BuildingProducerProps {
    buildingId: number
    level: number,
    workerForest: number,
    workerMine: number
}

export default function BuildingProducer({ buildingId, level, workerForest, workerMine }: BuildingProducerProps) {
    const { t } = useTranslation();

    const workers = buildingId === 11 ? workerForest : workerMine;
    const productionBase = workers;
    const per = (level / 100) * 2;
    const buildingName = t(`buildings.${buildingId}.name`);

    const items = [
        { label: t('modal.building.buildingProducer.productionBase'), value: productionBase, width: 100 - workers * per },
        { label: buildingName, value: productionBase * per, width: workers * per },
        { label: t('modal.building.buildingProducer.total'), value: productionBase + productionBase * per, width: 100 }
    ]

    return (
        <div className="p-3 text-sm">
            <div className="text-center font-semibold mb-3">
                {t('modal.building.buildingProducer.title', { building: buildingName })}
            </div>

            {items.map((item, idx) => (
                <div key={idx} className="flex my-2 items-center">
                    <div className="flex-[2] flex items-center">{item.label}:</div>
                    <div className="flex-1 flex items-center">{item.value.toFixed(2)}</div>
                    <div className="flex-4 h-5 border border-[#c99868] relative bg-gray-200">
                        <img src={lightGreenImg} alt="" className="absolute top-0 left-0 h-full w-[100%]" style={{ width: `${item.width}%` }} />
                        {/* <img src={brownImg} alt="" className="absolute top-0 left-0 h-full w-full opacity-50" /> */}
                    </div>
                </div>
            ))}
        </div>
    )
}