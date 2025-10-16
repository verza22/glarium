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

export interface BuildingInfo {
    buildingId: number
    level: number
}

export interface BuildingsModalRef {
    setInfo: (info: BuildingInfo) => void;
}

interface Props {
    ref: React.Ref<BuildingsModalRef>,
    close: () => void
}

export default function Buildings({ ref, close }: Props) {
    const { t } = useTranslation();
    const [info, setInfo] = React.useState<BuildingInfo | null>(null);

    React.useImperativeHandle(ref, () => ({
        setInfo: (info: BuildingInfo) => setInfo(info)
    }), []);

    if(info===null)
        return null;

    return (
        <div className="border p-2 rounded">
            <WindowLeft close={close} title={t(`buildings.${info.buildingId}.name`)}>
                <div className="text-justify font-normal mb-3">
                    {t(`buildings.${info.buildingId}.text`)}
                </div>

                {info.buildingId === 1 && <TownHall cityName="test" isCapital />}
                {info.buildingId === 2 && <Academy />}
                {info.buildingId === 3 && <Warehouse data={{
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
                {info.buildingId === 4 && <Barracks data={{
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
                {info.buildingId === 5 && <Tavern level={0} tavernWine={0} bonusTavern={0} bonusTavernConsume={0} />}
                {info.buildingId >= 6 && info.buildingId <= 10 && <Reducers buildingName={''} level={0} />}
                {info.buildingId >= 11 && info.buildingId <= 15 && <BuildingProducer data={{
                    buildingId: 0,
                    level: 0
                }} />}
                {info.buildingId === 16 && <Port speed={0} tradeShip={0} goldCost={0} gold={0} goldMissing={0} />}

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
                {info.buildingId === 4 && <UnitQueue />}
            </WindowRight>
        </div>
    )
}