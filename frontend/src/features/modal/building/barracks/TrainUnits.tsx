import React from 'react'
import { useTranslation } from 'react-i18next'

import Resources from './Resources'

export type Unit = {
  id: number
  trainer: number
  population: number
  wood: number
  wine: number
  glass: number
  sulfur: number
  gold: number
  time: number
}

export type ResourceSet = {
  population: number
  wood: number
  wine: number
  glass: number
  sulfur: number
  gold: number
  time: number
}

type Props = {
  units: Unit[]
  total: ResourceSet
  onTrain?: () => void
}

export default function TrainUnits({ units, total, onTrain }: Props) {
  const { t } = useTranslation()

  return (
    <div className="text-sm">
      <div className="text-center font-semibold mb-3">
        {t('modal.building.title')}
      </div>

      {total.population < 1 ? (
        <div className="text-red-500 flex justify-center items-center h-14">
          {t('modal.building.no_units')}
        </div>
      ) : (
        <div className="flex flex-wrap justify-center mb-3">
          {units.map(
            (unit, i) =>
              unit.trainer > 0 && (
                <div key={i} className="flex flex-col items-center mx-2">
                  <div
                    className={`unit unit_${unit.id} w-10 h-10 bg-contain bg-center bg-no-repeat`}
                  ></div>
                  <div className="text-center text-xs mt-1">
                    {unit.trainer}
                  </div>
                </div>
              )
          )}
        </div>
      )}

      <hr className="border-t border-red-400 my-3" />

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex-1">
          <Resources unit={total} disabled />
        </div>
        <div>
          <button
            className={`btnGeneral py-2 px-4 rounded-lg ${
              total.population < 1
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:brightness-110'
            }`}
            onClick={onTrain}
            disabled={total.population < 1}
          >
            {t('modal.building.button')}
          </button>
        </div>
      </div>
    </div>
  )
}