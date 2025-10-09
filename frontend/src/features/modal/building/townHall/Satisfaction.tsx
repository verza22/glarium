import React from 'react'
import { useTranslation } from 'react-i18next'

import cityIcon from '../../../../assets/img/icon/city.png'
import crownIcon from '../../../../assets/img/icon/crown.png'
import tavernIcon from '../../../../assets/img/icon/tavern.png'
import wineIcon from '../../../../assets/img/icon/icon_wine.png'
import happyIcon from '../../../../assets/img/icon/happy.png'

type Props = {
  capital: boolean
  tavern: number
  wineBonus: number
  populationNow: number
  corruption: number
}

export default function Satisfaction({
  capital,
  tavern,
  wineBonus,
  populationNow,
  corruption
}: Props) {
  const { t } = useTranslation()

  const totalHappiness = tavern + wineBonus + 196 + (capital ? 50 : 0) - corruption

  return (
    <div className="my-3">
      <div className="text-center font-semibold mb-1">{t('modal.building.satisfaction_title')}</div>
      <div className="text-justify mb-3">
        {t('modal.building.satisfaction_description')}
      </div>

      <div className="flex gap-4">
        {/* Bonuses and Maintenance */}
        <div className="flex-4 space-y-3">
          {/* Bonuses */}
          <div>
            <div className="text-center font-semibold mb-1">{t('modal.building.bonuses')}</div>

            {/* Base Bonus */}
            <div className="flex items-center mb-2">
              <div className="flex-1">{t('modal.building.basic_bonus')}</div>
              <div className="flex-4 flex gap-2">
                <div className="relative flex items-center justify-end bg-base h-6 pr-2 w-1/3">
                  <img src={cityIcon} alt="city" className="absolute left-1" />
                  <div>+196</div>
                </div>
                {capital && (
                  <div className="relative flex items-center justify-end bg-yellow h-6 pr-2 w-1/6">
                    <img src={crownIcon} alt="crown" className="absolute left-1" />
                    <div>+50</div>
                  </div>
                )}
              </div>
            </div>

            {/* Wine Bonus */}
            <div className="flex items-center mb-2">
              <div className="flex-1">{t('modal.building.wine')}</div>
              {tavern !== 0 ? (
                <div className="flex-4 flex gap-2">
                  <div className="relative flex items-center justify-end bg-tavern h-6 pr-2 w-1/5">
                    <img src={tavernIcon} alt="tavern" className="absolute left-1" />
                    <div>+{tavern}</div>
                  </div>
                  <div className="relative flex items-center justify-end bg-wine h-6 pr-2 w-1/3">
                    <img src={wineIcon} alt="wine" className="absolute left-1" />
                    <div>+{wineBonus}</div>
                  </div>
                </div>
              ) : (
                <div className="flex-4">{t('modal.building.no_tavern')}</div>
              )}
            </div>
          </div>

          {/* Maintenance */}
          <div>
            <div className="text-center font-semibold mt-3 mb-1">{t('modal.building.maintenance')}</div>

            <div className="flex items-center mb-2">
              <div className="flex-1">{t('modal.building.population')}:</div>
              <div className="flex-4">
                <div className="bg-red-400 h-6 flex items-center justify-end pr-2">{populationNow}</div>
              </div>
            </div>

            {!capital && (
              <div className="flex items-center mb-2">
                <div className="flex-1">{t('modal.building.corruption')}:</div>
                <div className="flex-4">
                  <div className="bg-red-700 h-6 flex items-center justify-end pr-2">{corruption}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Satisfaction Panel */}
        <div className="flex-1 text-center space-y-1">
          <div>{t('modal.building.satisfaction_level')}</div>
          <div>
            <img src={happyIcon} alt="happy" className="mx-auto" />
          </div>
          <div>{totalHappiness}</div>
          <div>{t('modal.building.happy')}</div>
        </div>
      </div>
    </div>
  )
}