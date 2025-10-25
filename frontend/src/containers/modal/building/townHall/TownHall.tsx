import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import CityNameForm from './CityNameForm'
import Information from './Information'
import Notice from './Notice'
import Satisfaction from './Satisfaction'
import { useBuildingGetLevel } from '../../../../hooks/useBuildingGetLevel'
import { useCityStore } from '../../../../store/cityStore'
import { useUserStore } from '../../../../store/userStore'
import { useGetCurrentCity } from '../../../../hooks/useGetCurrentCity'

export default function TownHall() {
    const { t } = useTranslation()
    const [showChangeCity, setShowChangeCity] = useState(false);
    const tavernLevel = useBuildingGetLevel(5);
    const { population, userResources, actionPoints } = useCityStore();
    const worldConfig = useUserStore(state=> state.worldConfig);

    const city = useGetCurrentCity();
    const cityName = city?.name ? city.name : '';
    const isCapital = city?.capital ? city.capital : false;

    const dummyInformation = {
        populationNow: population.populationAvailable,
        populationMax: population.population,
        apoint: actionPoints.point,
        apointMax: actionPoints.pointMax,
        populationProduce: 0,//TODO
        totalGold: userResources.gold.toFixed(),
        corruption: 0
    }

    const dummyNotice = {
        corruption: 0
    }

    const satisfaction = {
        capital: isCapital,
        tavern: tavernLevel * 12,
        wineBonus: (((population.wine*worldConfig.bonus.tavern)/12)),
        populationNow: population.population,
        corruption: 0
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
            <Satisfaction {...satisfaction} />
        </div>
    )
}