import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import CityNameForm from './CityNameForm'
import Information from './Information'
import Notice from './Notice'
import Satisfaction from './Satisfaction'

type Props = {
    cityName: string
    isCapital: boolean
}

export default function TownHall({ cityName, isCapital }: Props) {
    const { t } = useTranslation()
    const [showChangeCity, setShowChangeCity] = useState(false)

    const dummyInformation = {
        populationNow: 1200,
        populationMax: 2000,
        apoint: 15,
        apointMax: 20,
        populationProduce: 25,
        totalGold: 5000,
        corruption: 10
    }

    const dummyNotice = {
        corruption: 35
    }

    const dummySatisfaction = {
        capital: isCapital,
        tavern: 12,
        wineBonus: 30,
        populationNow: 1200,
        corruption: 15
    }

    return (
        <div className="text-sm leading-snug space-y-4">
            {showChangeCity && (
                <CityNameForm
                    currentName={cityName}
                    onSubmit={() => setShowChangeCity(false)}
                />
            )}

            <div
                className="text-center font-semibold cursor-pointer mb-3"
                onClick={() => setShowChangeCity((prev) => !prev)}
            >
                {isCapital
                    ? `${t('modal.building.capital')} ${cityName}`
                    : `${t('modal.building.colony')} ${cityName}`}
            </div>

            <Information {...dummyInformation} />
            <Notice {...dummyNotice} />
            <Satisfaction {...dummySatisfaction} />
        </div>
    )
}