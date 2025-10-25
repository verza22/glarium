import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import WindowLeft from './../window/WindowLeft'
import WindowRight from './../window/WindowRight'
import UpgradeBuilding from './UpgradeBuilding'
import TownHall from './townHall/TownHall'
import Academy from './Academy'
import Warehouse from './Warehouse'
import Reducers from './Reducers'
import BuildingProducer from './BuildingProducer'
import Port from './Port'
import Tavern from './Tavern'
import Barracks from './barracks/Barracks'
import UnitQueue from './barracks/UnitQueue'
import { useBuildingNextLevel } from '../../../hooks/useBuildingNextLevel'
import { ResponseBuildingNextLevel } from '@shared/types/responses'
import { useBuildingUpgrade } from '../../../hooks/useBuildingUpgrade'
import { useCityStore } from '../../../store/cityStore'
import { useBuyTradeShip } from '../../../hooks/useBuyTradeShip'
import { useCitySetWine } from '../../../hooks/useCitySetWine'
import { useCitySetScientists } from '../../../hooks/useCitySetScientist'
import { useUnitCreate } from '../../../hooks/useUnitCreate'

export interface BuildingData {
    buildingId: number,
    position: number
}

export interface BuildingsModalRef {
    setBuildingData: (data: BuildingData) => void;
}

interface Props {
    ref: React.Ref<BuildingsModalRef>,
    close: () => void
}

export default function Buildings({ ref, close }: Props) {
    const { t } = useTranslation();
    const [data, setData] = React.useState<ResponseBuildingNextLevel | null>(null);
    const { mutate: getNextLevel } = useBuildingNextLevel();
    const { mutate: upgradeBuilding } = useBuildingUpgrade();
    const { mutate: buyTradeShip } = useBuyTradeShip();
    const { mutate: setWine } = useCitySetWine();
    const { mutate: setScientists } = useCitySetScientists();

    const { population, userResources, resources } = useCityStore();

    React.useImperativeHandle(ref, () => ({
        setBuildingData: (data: BuildingData) => {
            getNextLevel(data, {
                onSuccess(response: ResponseBuildingNextLevel) {
                    setData(response);
                }
            })
        }
    }), []);

    if (data === null)
        return null;

    const upgrade = () => {
        upgradeBuilding({ cityBuildingId: data.cityBuildingId }, {
            onSuccess() {
                close();
            }
        });
    }

    const handleBuyTradeShip = () => {
        buyTradeShip();
    }

    const handleTavern = (wine: number) => {
        setWine(wine, {
            onSuccess() {
                close();
            }
        });
    }

    const handleScients = (scientist: number) => {
        setScientists(scientist, {
            onSuccess() {
                close();
            }
        });
    }

    return (
        <div className="border p-2 rounded">
            <WindowLeft close={close} title={t(`buildings.${data.buildingId}.name`)}>
                <div className="text-justify font-normal mb-3">
                    {t(`buildings.${data.buildingId}.text`)}
                </div>

                {data.buildingId === 1 && <TownHall />}
                {data.buildingId === 2 && <Academy scientist={data.academy?.scientists ? data.academy.scientists : 0} scientistMax={data.academy?.scientistsMax ? data.academy.scientistsMax : 0} handleScients={handleScients} />}
                {data.buildingId === 3 && <Warehouse level={data.level - 1} resources={resources} />}
                {data.buildingId === 4 && <Barracks level={data.level - 1} units={data?.units ? data.units : []} barracks={data?.barracks ? data.barracks : null} close={close} />}
                {data.buildingId === 5 && <Tavern level={data.level - 1} tavernWine={data.tavern?.wine ? data.tavern.wine : 0} tavernWineMax={data.tavern?.wineMax ? data.tavern.wineMax : 0} handleTavern={handleTavern} />}
                {data.buildingId >= 6 && data.buildingId <= 10 && <Reducers buildingId={data.buildingId} level={data.level - 1} />}
                {data.buildingId >= 11 && data.buildingId <= 15 && <BuildingProducer buildingId={data.buildingId} level={data.level - 1} workerForest={population.workerForest} workerMine={population.workerMine} />}
                {data.buildingId === 16 && <Port tradeShip={userResources.tradeShip} gold={userResources.gold} level={data.level - 1} buyTradeShip={handleBuyTradeShip} />}

            </WindowLeft>

            <WindowRight title="Upgrade">
                <UpgradeBuilding info={data} upgrade={upgrade} />
                {data.buildingId === 4 && <UnitQueue tails={data?.barracks?.tails ? data.barracks.tails : null} />}
            </WindowRight>
        </div>
    )
}