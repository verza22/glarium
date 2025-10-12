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

type BuildingInfo = {
    building_id: number
    level?: number
}

type Props = {
    info: BuildingInfo
    close: () => void
}

export default function Buildings({ info, close }: Props) {
    const { t } = useTranslation()
    const [buildingId, setBuildingId] = useState(info.building_id)

    useEffect(() => {
        setBuildingId(info.building_id)
    }, [info])

    return (
        <div className="border p-2 rounded">
            <WindowLeft close={close} title={t(`buildings.${buildingId}.name`)}>
                <div className="text-justify font-normal mb-3">
                    {t(`buildings.${buildingId}.text`)}
                </div>

                {buildingId === 1 && <TownHall cityName="test" isCapital />}
                {buildingId === 2 && <Academy />}
                {buildingId === 3 && <Warehouse data={{
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
                {buildingId === 4 && <Barracks data={{
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
                {buildingId === 5 && <Tavern level={0} tavernWine={0} bonusTavern={0} bonusTavernConsume={0} />}
                {buildingId >= 6 && buildingId <= 10 && <Reducers buildingName={''} level={0} />}
                {buildingId >= 11 && buildingId <= 15 && <BuildingProducer data={{
                    buildingId: 0,
                    level: 0
                }} />}
                {buildingId === 16 && <Port speed={0} tradeShip={0} goldCost={0} gold={0} goldMissing={0} />}

            </WindowLeft>

            <WindowRight title="Upgrade">
                <UpgradeBuilding info={{
                    maximum: false,
                    level: 0,
                    wood: 0,
                    wine: 0,
                    marble: 0,
                    glass: 0,
                    sulfur: 0,
                    time: 0
                }}  />
                {buildingId === 4 && <UnitQueue />}
            </WindowRight>
        </div>
    )
}