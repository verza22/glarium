import React from 'react'
import { useTranslation } from 'react-i18next'

import BtnUpgrade from '../../../assets/icon/btn_upgrade.jpg'
import BtnDowngrade from '../../../assets/icon/btn_downgrade.jpg'
import WoodIcon from '../../../assets/icon/icon_wood.png'
import WineIcon from '../../../assets/icon/icon_wine.png'
import MarbleIcon from '../../../assets/icon/icon_marble.png'
import GlassIcon from '../../../assets/icon/icon_glass.png'
import SulfurIcon from '../../../assets/icon/icon_sulfur.png'
import TimeIcon from '../../../assets/icon/icon_time.png'

type Props = {
  info: {
    maximum: boolean
    level: number
    wood: number
    wine: number
    marble: number
    glass: number
    sulfur: number
    time: number
  }
}

export default function UpgradeBuilding({ info }: Props) {
  const { t } = useTranslation()

  // Dummy reducers for display
  const reducerWood = 1
  const reducerWine = 1
  const reducerMarble = 1
  const reducerGlass = 1
  const reducerSulfur = 1

  const level = info.maximum ? info.level : info.level - 1

  const formatNumber = (num: number) => num.toLocaleString()
  const formatTime = (sec: number) => `${sec} s` // dummy

  return (
    <div className="bg-white p-4 rounded-md shadow-md text-sm mb-3">
      <div className="flex justify-center space-x-6">
        {!info.maximum && (
          <div className="flex flex-col items-center cursor-pointer">
            <div className="w-10 h-10 mb-1">
              <img src={BtnUpgrade} alt="upgrade" className="w-full h-full" />
            </div>
            <div>{t('modal.building.upgrade')}</div>
          </div>
        )}

        <div className="px-2 text-center">
          <div>{t('modal.building.level')}</div>
          <div className="text-2xl font-bold">{level}</div>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-10 h-10 mb-1">
            <img src={BtnDowngrade} alt="demolition" className="w-full h-full" />
          </div>
          <div>{t('modal.building.demolition')}</div>
        </div>
      </div>

      <div className="text-center mt-3">
        {t('modal.building.upgradeText', { level: info.level })}
      </div>

      <div className="my-2 flex justify-center space-x-3">
        {info.wood !== 0 && (
          <div title={t('resources.wood')} className="flex items-center space-x-1">
            <img src={WoodIcon} className="w-4 h-4" />
            <span>{formatNumber(info.wood * reducerWood)}</span>
          </div>
        )}
        {info.wine !== 0 && (
          <div title={t('resources.wine')} className="flex items-center space-x-1">
            <img src={WineIcon} className="w-4 h-4" />
            <span>{formatNumber(info.wine * reducerWine)}</span>
          </div>
        )}
        {info.marble !== 0 && (
          <div title={t('resources.marble')} className="flex items-center space-x-1">
            <img src={MarbleIcon} className="w-4 h-4" />
            <span>{formatNumber(info.marble * reducerMarble)}</span>
          </div>
        )}
        {info.glass !== 0 && (
          <div title={t('resources.glass')} className="flex items-center space-x-1">
            <img src={GlassIcon} className="w-4 h-4" />
            <span>{formatNumber(info.glass * reducerGlass)}</span>
          </div>
        )}
        {info.sulfur !== 0 && (
          <div title={t('resources.sulfur')} className="flex items-center space-x-1">
            <img src={SulfurIcon} className="w-4 h-4" />
            <span>{formatNumber(info.sulfur * reducerSulfur)}</span>
          </div>
        )}
      </div>

      {info.time !== 0 && (
        <div className="text-center mt-2 flex justify-center items-center space-x-1" title={t('resources.time')}>
          <img src={TimeIcon} className="w-4 h-4" />
          <span>{formatTime(info.time)}</span>
        </div>
      )}
    </div>
  )
}