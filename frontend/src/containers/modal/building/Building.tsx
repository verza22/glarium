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
    const [data, setData] = React.useState<ResponseBuildingNextLevel|null>(null);
    const { mutate: getNextLevel } = useBuildingNextLevel();
    const { mutate: upgradeBuilding } = useBuildingUpgrade();
    const { population, userResources } = useCityStore();

    React.useImperativeHandle(ref, () => ({
        setBuildingData: (data: BuildingData) => {
            getNextLevel(data, { onSuccess(response: ResponseBuildingNextLevel){
                setData(response);
            }})
        }
    }), []);

    if(data===null)
        return null;

    const upgrade = () => {
        upgradeBuilding({ cityBuildingId: data.cityBuildingId }, { onSuccess(){ 
            close();
        }});
    }

    return (
        <div className="border p-2 rounded">
            <WindowLeft close={close} title={t(`buildings.${data.buildingId}.name`)}>
                <div className="text-justify font-normal mb-3">
                    {t(`buildings.${data.buildingId}.text`)}
                </div>

                {data.buildingId === 1 && <TownHall cityName="test" isCapital />}
                {data.buildingId === 2 && <Academy />}
                {data.buildingId === 3 && <Warehouse data={{
                    level: 0,
                    maximum: false,
                    resources: {
                        glass: 0,
                        gold: 0,
                        marble: 0,
                        population: 0,
                        sulfur: 0,
                        timec: 0,
                        wine: 0,
                        wood: 0
                    }
                }} />}
                {data.buildingId === 4 && <Barracks data={{
                    level: 0,
                    units: [],
                    resources: {
                        population: 0,
                        wood: 0,
                        wine: 0,
                        glass: 0,
                        sulfur: 0,
                        gold: 0,
                        time: 0
                    }
                }}  />}
                {data.buildingId === 5 && <Tavern level={0} tavernWine={0} bonusTavern={0} bonusTavernConsume={0} />}
                {data.buildingId >= 6 && data.buildingId <= 10 && <Reducers buildingId={data.buildingId} level={data.level-1} />}
                {data.buildingId >= 11 && data.buildingId <= 15 && <BuildingProducer buildingId={data.buildingId} level={data.level-1} workerForest={population.workerForest} workerMine={population.workerMine} />}
                {data.buildingId === 16 && <Port speed={0} tradeShip={userResources.tradeShip} goldCost={0} gold={userResources.gold} goldMissing={0} />}

            </WindowLeft>

            <WindowRight title="Upgrade">
                <UpgradeBuilding info={data} upgrade={upgrade} />
                {data.buildingId === 4 && <UnitQueue />}
            </WindowRight>
        </div>
    )
}