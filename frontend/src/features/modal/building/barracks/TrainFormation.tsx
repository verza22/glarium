import React from 'react'
import { useTranslation } from 'react-i18next'
import Resources from './Resources'

type Unit = {
  id: number
  name?: string
  text?: string
  barrackLevel: number
  trainer: number
  population: number
  wood: number
  wine: number
  glass: number
  sulfur: number
  gold: number
  time: number
}

type Props = {
  units?: Unit[]
  level: number
  onChangeTrainer?: (unit: Unit, value: number) => void
  onMaxTrainer?: (unit: Unit) => void
  getUnitCount?: (id: number) => number
}

export default function TrainFormation({
  units,
  level,
  onChangeTrainer,
  onMaxTrainer,
  getUnitCount
}: Props) {
  const { t } = useTranslation()

  return (
    <div className="text-sm">
      <div className="text-center font-semibold mt-4 mb-3">
        {t('modal.formation.trainFormation')}
      </div>

      {units && units.map((unit, i) => (
        <div key={i} className="flex flex-wrap mb-8 text-justify">
          <div className="flex-1 flex justify-center relative">
            <img
              src={`/assets/units/${unit.id}.png`}
              alt={t(`units.${unit.id}.name`)}
              className="w-16 h-16 object-contain"
            />
            <div className="absolute bottom-[-1.8rem] text-xs font-medium">
              {getUnitCount ? getUnitCount(unit.id) : 0}
            </div>
          </div>

          <div className="flex-[5] px-5">
            <div className="font-semibold">{t(`units.${unit.id}.name`)}</div>
            <div className="text-gray-600 mt-1 leading-4">
              {t(`units.${unit.id}.text`)}
            </div>
            <hr className="border-t border-red-400 my-2" />
            <Resources unit={unit} />
          </div>

          <div className="flex-[2] flex flex-col items-center justify-center text-center">
            {level >= unit.barrackLevel ? (
              <>
                <input
                  type="number"
                  className="w-16 border rounded text-center text-sm py-1"
                  value={unit.trainer}
                  onChange={(e) =>
                    onChangeTrainer && onChangeTrainer(unit, Number(e.target.value))
                  }
                />
                <div
                  className="text-blue-600 underline cursor-pointer mt-1 text-xs"
                  onClick={() => onMaxTrainer && onMaxTrainer(unit)}
                >
                  {t('modal.formation.max')}
                </div>
              </>
            ) : (
              <div className="text-xs text-gray-600">
                {t('modal.formation.required_level', {
                  level: unit.barrackLevel
                })}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}