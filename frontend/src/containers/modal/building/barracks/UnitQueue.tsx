import React from 'react'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'

import unit1 from '../../../../assets/img/unit/1.png'
import unit2 from '../../../../assets/img/unit/2.png'
import unit3 from '../../../../assets/img/unit/3.png'
import unit4 from '../../../../assets/img/unit/4.png'
import unit5 from '../../../../assets/img/unit/5.png'
import unit6 from '../../../../assets/img/unit/6.png'

const unitImages: Record<number, string> = {
    1: unit1,
    2: unit2,
    3: unit3,
    4: unit4,
    5: unit5,
    6: unit6
}

type Props = {
    tails: {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        constructedAt: Date | null;
        regimentId: number;
        unitId: number;
        cant: number;
        tail: number;
    }[] | null;
}

export default function UnitQueue({ tails }: Props) {
  const { t } = useTranslation();

  return (
    <div className="p-0 text-sm">
      {tails && tails.length > 0 && (
        <div className="mb-2">
          <hr className="mt-0 border-gray-300" />
          <div className="text-center font-semibold mb-2">{t('modal.building.list_title')}</div>

          {tails.map((tail, index) => {
            return (
              <div key={tail.id}>
                {tail && (
                  <div className="mb-4">
                    <div className="mb-2 text-center">{t('modal.building.building')}: {tail.constructedAt ? dayjs(tail.constructedAt).format('YYYY-MM-DD HH:mm:ss') : '—'}</div>

                    <div className="flex justify-center flex-wrap gap-2">
                        <div className="flex items-center flex-col">
                          <div className="w-10 h-10 bg-center bg-no-repeat bg-contain" style={{ backgroundImage: `url(${unitImages[tail.unitId]})` }} />
                          <div className="text-center text-xs mt-1">{tail.cant}</div>
                        </div>
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