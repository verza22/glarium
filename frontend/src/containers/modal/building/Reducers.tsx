import React from 'react'
import { useTranslation } from 'react-i18next'

import lightGreen from '../../../assets/img/icon/lightgreen.png'
import lightBrown from '../../../assets/img/icon/lightbrown.png'

type ReducerItem = {
  name: string
  per: number
  per2: number
}

type Props = {
  buildingName: string
  level: number
}

export default function Reducers({ buildingName, level }: Props) {
  const { t } = useTranslation()

  // Datos dummy para UI
  const dataBuilding: ReducerItem[] = [
    { name: t('modal.building.buildingReducer.costBase'), per: 0, per2: 100 },
    { name: t('modal.building.buildingReducer.research') + ' (4%)', per: 4, per2: 100 },
    { name: `- ${buildingName} (${level}%)`, per: level, per2: 96 }
  ]

  return (
    <div className="text-sm">
      <div>
        <div className="text-center font-semibold mb-3">
          {t('modal.building.buildingReducer.building', { building_id: buildingName })}
        </div>

        {dataBuilding.map((item, index) => (
          <div key={index} className="flex my-2 items-center">
            <div className="flex-2 flex items-center">{item.name}:</div>
            <div className="flex-1 flex items-center">{100 - item.per}%</div>
            <div className="flex-3 relative border border-[#c99868] h-5">
              <img src={lightGreen} className="absolute h-5 w-full top-0 left-0" />
              <img
                src={lightBrown}
                className="absolute h-5 top-0 left-0"
                style={{ width: `${100 - (item.per - (100 - item.per2))}%` }}
              />
            </div>
          </div>
        ))}

        <div className="text-center font-semibold mb-3 mt-4">
          {t('modal.building.buildingReducer.unit', { building_id: buildingName })}
        </div>

        <div className="flex my-2 items-center">
          <div className="flex-2 flex items-center">{t('modal.building.buildingReducer.costBase')}:</div>
          <div className="flex-1 flex items-center">100%</div>
          <div className="flex-3 relative border border-[#c99868] h-5">
            <img src={lightGreen} className="absolute h-5 w-full top-0 left-0" />
            <img src={lightBrown} className="absolute h-5 w-full top-0 left-0" />
          </div>
        </div>

        <div className="flex my-2 items-center">
          <div className="flex-2 flex items-center">- {buildingName} ({level}%)</div>
          <div className="flex-1 flex items-center">{100 - level}%</div>
          <div className="flex-3 relative border border-[#c99868] h-5">
            <img src={lightGreen} className="absolute h-5 w-full top-0 left-0" />
            <img
              src={lightBrown}
              className="absolute h-5 top-0 left-0"
              style={{ width: `${100 - level}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}