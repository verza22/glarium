import React from 'react'
import { useTranslation } from 'react-i18next'

import citizenIcon from '../../../../assets/img/island/citizen.png'
import livingSpaceIcon from '../../../../assets/img/icon/livingspace.png'
import actionPointIcon from '../../../../assets/img/icon/action_point.png'
import growthIcon from '../../../../assets/img/icon/growth_positive.png'
import incomeIcon from '../../../../assets/img/icon/income_positive.png'
import corruptionIcon from '../../../../assets/img/icon/corruption.png'
import happyIcon from '../../../../assets/img/icon/happy.png'

type Props = {
  populationNow: number
  populationMax: number
  apoint: number
  apointMax: number
  populationProduce: number
  totalGold: number
  corruption: number
}

export default function Information({
  populationNow,
  populationMax,
  apoint,
  apointMax,
  populationProduce,
  totalGold,
  corruption
}: Props) {
  const { t } = useTranslation()

  return (
    <div className="flex my-3 gap-4">
      {/* Citizen */}
      <div className="flex-1 text-center">
        <img src={citizenIcon} alt="citizen" className="mx-auto" />
      </div>

      {/* Population & Action Points */}
      <div className="flex-3 flex justify-center">
        <div className="space-y-1">
          <div className="flex items-center gap-1">
            <img src={livingSpaceIcon} alt="living space" className="w-4 h-4" />
            {t('modal.building.living_space', { current: populationNow, max: populationMax })}
          </div>
          <div className="flex items-center gap-1">
            <img src={actionPointIcon} alt="action point" className="w-4 h-4" />
            {t('modal.building.action_points', { current: apoint, max: apointMax })}
          </div>
        </div>
      </div>

      {/* Growth, Gold & Corruption */}
      <div className="flex-3 flex justify-center">
        <div className="space-y-1">
          <div className="flex items-center gap-1">
            <img src={growthIcon} alt="growth" className="w-4 h-4" />
            {t('modal.building.growth', { amount: populationProduce })}
          </div>
          <div className="flex items-center gap-1">
            <img src={incomeIcon} alt="income" className="w-4 h-4" />
            {t('modal.building.total_gold', { amount: totalGold })}
          </div>
          <div className="flex items-center gap-1">
            <img src={corruptionIcon} alt="corruption" className="w-4 h-4" />
            {t('modal.building.corruption', { amount: corruption })}
          </div>
        </div>
      </div>

      {/* Happiness */}
      <div className="flex-2 text-center">
        <img src={happyIcon} alt="happy" className="mx-auto" />
        <div className="mt-2">{t('modal.building.happy')}</div>
      </div>
    </div>
  )
}