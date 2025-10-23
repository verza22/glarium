import React from 'react'
import { useTranslation } from 'react-i18next'

import portImg from '../../../assets/img/city/16.png'
import shipImg from '../../../assets/img/icon/ship_transport.png'
import goldIcon from '../../../assets/img/icon/icon_gold.png'
import { useUserStore } from '../../../store/userStore'

interface PortProps {
    tradeShip: number
    gold: number,
    level: number,
    buyTradeShip: () => void
}

export default function Port({
    tradeShip,
    gold,
    level,
    buyTradeShip
}: PortProps) {
    const { t } = useTranslation();
    const worldConfig = useUserStore(state => state.worldConfig);

    const speed = Math.floor(worldConfig.load_speed_base + (level * worldConfig.load_speed));

    const goldCost = () => {
        let level = tradeShip + 1;
        let goldCost = 0;
        if (level < 10) {
            goldCost = level * 490;
        }
        else {
            const coefficient = (level / 1000) + 1.8;
            goldCost = Math.floor(Math.pow(level, coefficient) * (80 + (level / 10)));
        }
        return goldCost;
    }

    const goldMissing = () => {
        return goldCost() - gold;
    }

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
                    <div className="absolute -bottom-[25px] text-center">{tradeShip}/180</div>
                </div>

                <div className="flex flex-col items-center">
                    <div className="text-center mb-2">
                        {t('modal.building.port.cost')}: <img src={goldIcon} alt="Gold" className="inline w-4 h-4" /> {goldCost()}
                    </div>
                    {gold > goldCost() ? (
                        <button onClick={buyTradeShip} className="bg-yellow-500 text-black px-3 py-2 rounded cursor-pointer">{t('modal.building.port.tradeShipBuyBtn')}</button>
                    ) : (
                        <div className="text-red-600 text-center">
                            <div>{t('modal.building.port.tradeShipBuyMissing1')}</div>
                            <div>{t('modal.building.port.tradeShipBuyMissing2', { goldMissing: goldMissing() })}</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}