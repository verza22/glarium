import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import CitizenIcon from '../../../assets/img/island/citizen.png'
import ScientistIcon from '../../../assets/img/icon/scientist.png'
import GoldIcon from '../../../assets/img/icon/icon_gold.png'
import PiIcon from '../../../assets/img/icon/icon_pi.png'
import BtnMin from '../../../assets/img/icon/btn_min.png'
import BtnMax from '../../../assets/img/icon/btn_max.png'

type Props = {}

export default function Academy({}: Props) {
  const { t } = useTranslation()
  const [value, setValue] = useState(0)
  const max = 30
  const populationAvailable = 100 // dummy
  const scientistCost = 5 // dummy
  const corruption = 0.2 // dummy

  const income = (populationAvailable * 3) - (value * scientistCost)
  const production = value * corruption

  const handleMin = () => setValue(0)
  const handleMax = () => setValue(max)
  const handleConfirm = () => alert('Confirmed') // dummy

  return (
    <div className="bg-white p-4 rounded-md shadow-md mb-3">
      <div className="text-center font-semibold mb-4">{t('modal.building.workers')}</div>
      <div className="flex space-x-4">
        {/* Citizen */}
        <div className="flex-1 flex flex-col items-center relative">
          <img src={CitizenIcon} className="mb-2" />
          <div className="absolute bottom-0 font-bold">{populationAvailable}</div>
        </div>

        {/* Slider and info */}
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
                <span>{production}</span>
                <img src={PiIcon} className="w-4 h-4" />
                <span>{t('modal.building.perHour')}</span>
              </div>
            </div>
          </div>

          {/* Slider */}
          <div className="flex items-center space-x-2">
            <div
              className="w-6 h-6 bg-no-repeat bg-center cursor-pointer"
              style={{ backgroundImage: `url(${BtnMin})` }}
              onClick={handleMin}
            />
            <div className="flex-1">
              {/* <Slider
                min={0}
                max={max}
                value={value}
                onChange={setValue}
                trackStyle={{ backgroundColor: '#6366F1', height: 16 }}
                handleStyle={{ borderColor: '#4F46E5', height: 24, width: 24 }}
              /> */}
            </div>
            <div
              className="w-6 h-6 bg-no-repeat bg-center cursor-pointer"
              style={{ backgroundImage: `url(${BtnMax})` }}
              onClick={handleMax}
            />
          </div>

          {/* Input and confirm */}
          <div className="flex justify-center space-x-3">
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(Number(e.target.value))}
              className="w-20 border rounded px-2 py-1 text-center"
            />
            <button
              className="px-3 py-1 bg-indigo-600 text-white rounded"
              onClick={handleConfirm}
            >
              {t('modal.building.confirm')}
            </button>
          </div>
        </div>

        {/* Scientist */}
        <div className="flex-1 flex flex-col items-center relative">
          <img src={ScientistIcon} className="mb-2" />
          <div className="absolute bottom-0 font-bold">{value}</div>
        </div>
      </div>
    </div>
  )
}