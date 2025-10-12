import React from 'react'
import { useTranslation } from 'react-i18next'

import portImg from '../../../assets/img/city/16.png'
import shipImg from '../../../assets/img/icon/ship_transport.png'
import goldIcon from '../../../assets/img/icon/icon_gold.png'

type Props = {
  speed: number
  tradeShip: number
  goldCost: number
  gold: number
  goldMissing: number
}

export default function Port({
  speed,
  tradeShip,
  goldCost,
  gold,
  goldMissing
}: Props) {
  const { t } = useTranslation()

  return (
    <div className="text-sm pt-2 pb-5">
      <div className="text-center font-semibold">{t('modal.building.port.speedTitle')}</div>
      <div>{t('modal.building.port.speedText')}</div>
      <div className="flex justify-center mt-3 items-center gap-2">
        <img src={portImg} alt="Port" className="w-10" />
        <div>{speed} {t('modal.building.port.speedMin')}</div>
      </div>

      <div className="text-center font-semibold mt-3">{t('modal.building.port.tradeShipBuyTitle')}</div>
      <div>{t('modal.building.port.tradeShipBuyText')}</div>
      <div className="flex justify-center mt-2 gap-4 items-center">
        <div className="relative flex flex-col items-center">
          <img src={shipImg} alt="Ship" />
          <div className="absolute bottom-0 text-center">{tradeShip}/180</div>
        </div>

        <div className="flex flex-col items-center">
          <div className="text-center mb-2">
            {t('modal.other.cost')}: <img src={goldIcon} alt="Gold" className="inline w-4 h-4" /> {goldCost}
          </div>
          {gold > goldCost ? (
            <button className="bg-yellow-500 text-black px-3 py-2 rounded">{t('modal.building.port.tradeShipBuyBtn')}</button>
          ) : (
            <div className="text-red-600 text-center">
              <div>{t('modal.building.port.tradeShipBuyMissing1')}</div>
              <div>{t('modal.building.port.tradeShipBuyMissing2', { goldMissing })}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}