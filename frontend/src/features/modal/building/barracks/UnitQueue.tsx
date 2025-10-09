import React from 'react'
import { useTranslation } from 'react-i18next'

import unit_1 from '../../../../assets/img/unit/1.png'
import unit_2 from '../../../../assets/img/unit/2.png'
import unit_3 from '../../../../assets/img/unit/3.png'
import unit_4 from '../../../../assets/img/unit/4.png'

type Unit = {
  unitId: number
  quantity: number
}

type Tail = {
  tail: number // 0,1,2
  constructedAt?: string
  units: Unit[]
}

type Props = {
  tails?: Tail[]
}

export default function UnitQueue({ tails = [] }: Props) {
  const { t } = useTranslation()

  const unitImageMap: Record<number, string> = {
    1: unit_1,
    2: unit_2,
    3: unit_3,
    4: unit_4
  }

  return (
    <div className="p-0 text-sm">
      {tails.length > 0 && (
        <div className="mb-2">
          <hr className="mt-0 border-gray-300" />
          <div className="text-center font-semibold mb-2">{t('modal.building.list_title')}</div>

          {[0, 1, 2].map((index) => {
            const tail = tails.find((t) => t.tail === index)
            return (
              <div key={index}>
                {tail && (
                  <div className="mb-4">
                    <div className="mb-2 text-center">{t('modal.building.building')}: {tail.constructedAt ?? '—'}</div>

                    <div className="flex justify-center flex-wrap gap-2">
                      {tail.units.map((unit, i) => (
                        <div key={i} className="flex items-center flex-col">
                          <div className="w-10 h-10 bg-center bg-no-repeat bg-contain" style={{ backgroundImage: `url(${unitImageMap[unit.unitId] || unit_1})` }} />
                          <div className="text-center text-xs mt-1">{unit.quantity}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

/*
  Example usage:
  <UnitQueue
    tails={[
      { tail: 0, constructedAt: '2025-10-09T12:00:00Z', units: [{ unitId: 1, quantity: 5 }] },
      { tail: 1, constructedAt: '2025-10-09T12:30:00Z', units: [{ unitId: 2, quantity: 3 }] }
    ]}
  />
*/