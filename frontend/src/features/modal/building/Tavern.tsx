import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import wineImg from '../../../assets/img/icon/wine-big.png'
import happyImg from '../../../assets/img/icon/happy.png'
import btnMin from '../../../assets/img/icon/btn_min.png'
import btnMax from '../../../assets/img/icon/btn_max.png'

type Props = {
  level: number
  tavernWine: number
  bonusTavern: number
  bonusTavernConsume: number
}

export default function Tavern({
  level,
  tavernWine,
  bonusTavern,
  bonusTavernConsume
}: Props) {
  const { t } = useTranslation()
  const [value, setValue] = useState(tavernWine * bonusTavernConsume)
  const max = level * 12 * bonusTavernConsume

  const satisfiedCitizens = Math.round(((value / bonusTavernConsume) / 12) * bonusTavern * 60)

  const handleMin = () => setValue(0)
  const handleMax = () => setValue(max)
  const handleConfirm = () => {
    // Lógica backend eliminada, solo UI
    console.log('Confirm wine amount:', value)
  }

  return (
    <div className="text-sm leading-snug mb-3">
      <div className="text-center font-semibold mb-2">{t('modal.tavern.title')}</div>
      <div className="text-justify w-3/4 mx-auto mb-3">
        {t('modal.tavern.description')}
      </div>

      <div className="flex mt-3">
        <div className="flex-1 flex justify-center items-start">
          <img className="mb-2" src={wineImg} alt="wine" />
        </div>

        <div className="flex-3">
          <div className="flex text-right mb-3">
            <div className="flex-1">
              +{satisfiedCitizens} {t('modal.tavern.citizensSatisfied')}
            </div>
          </div>

          <div className="flex my-3 items-center">
            <div
              className="flex-1 h-4 cursor-pointer"
              style={{ backgroundImage: `url(${btnMin})`, backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}
              onClick={handleMin}
            />
            <div className="flex-10 px-2">
            </div>
            <div
              className="flex-1 h-4 cursor-pointer"
              style={{ backgroundImage: `url(${btnMax})`, backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}
              onClick={handleMax}
            />
          </div>

          <div className="flex justify-center mt-3">
            <select
              className="border px-2 py-1 w-24"
              value={value}
              onChange={(e) => setValue(Number(e.target.value))}
            >
              <option value={0}>{t('modal.tavern.noWine')}</option>
              {Array.from({ length: level }, (_, i) => (
                <option key={i} value={(i + 1) * 12 * bonusTavernConsume}>
                  {(i + 1) * 12 * bonusTavernConsume} {t('modal.tavern.winePerHour')}
                </option>
              ))}
            </select>
            <button
              className="ml-3 px-3 py-1 bg-blue-500 text-white rounded"
              onClick={handleConfirm}
            >
              {t('other.confirm')}
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