import React from 'react'
import { useTranslation } from 'react-i18next'

import Resources from './Resources'

import unit1 from '../../../../assets/img/unit/1.png'
import unit2 from '../../../../assets/img/unit/2.png'
import unit3 from '../../../../assets/img/unit/3.png'
import unit4 from '../../../../assets/img/unit/4.png'
import unit5 from '../../../../assets/img/unit/5.png'
import unit6 from '../../../../assets/img/unit/6.png'

const unitImages: Record<number, string> = {
    1: unit1,
    2: unit2,
    3: unit3,
    4: unit4,
    5: unit5,
    6: unit6
}

export type Unit = {
    id: number
    barrackLevel: number
    trainer: number
    population: number
    wood: number
    wine: number
    glass: number
    sulfur: number
    gold: number
    time: number
}

type Props = {
    units: Unit[]
    handleTrain: () => void
}

export default function TrainUnits({ units, handleTrain }: Props) {
    const { t } = useTranslation();

    const total = React.useMemo(() => {

        let wood = 0;
        let glass = 0;
        let wine = 0;
        let sulfur = 0;
        let time = 0;
        let population = 0;
        let gold = 0;

        units.forEach(u => {
            wood += u.trainer * u.wood;
            glass += u.trainer * u.glass;
            wine += u.trainer * u.wine;
            sulfur += u.trainer * u.sulfur;
            time += u.trainer * u.time;
            population += u.trainer * u.population;
            gold += u.trainer * u.gold;
        });

        return {
            wood: wood,
            glass: glass,
            wine: wine,
            sulfur: sulfur,
            time: time,
            population: population,
            gold: gold
        }
    }, [units]);

    return (
        <div className="text-sm">
            <div className="text-center font-semibold mb-3">
                {t('modal.building.title')}
            </div>

            {total.population < 1 ? (
                <div className="text-red-500 flex justify-center items-center h-14">
                    {t('modal.building.no_units')}
                </div>
            ) : (
                <div className="flex flex-wrap justify-center mb-3">
                    {units.map(
                        (unit, i) =>
                            unit.trainer > 0 && (
                                <div key={i} className="flex flex-col items-center mx-2">
                                    <div
                                        className={`unit w-10 h-10 bg-contain bg-center bg-no-repeat`}
                                    >
                                        <img
                                            src={unitImages[unit.id] || ''}
                                            alt={t(`units.${unit.id}.name`)}
                                            className="w-16 h-16 object-contain"
                                        />
                                    </div>
                                    <div className="text-center text-xs mt-1">
                                        {unit.trainer}
                                    </div>
                                </div>
                            )
                    )}
                </div>
            )}

            <hr className="border-t border-red-400 my-3" />

            <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex-1">
                    <Resources unit={total} disabled />
                </div>
                <div>
                    <button
                        className={`ml-3 px-3 py-1 bg-blue-500 text-white rounded ${total.population > 0 ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                        onClick={handleTrain}
                        disabled={total.population < 1}
                    >
                        {t('modal.building.button')}
                    </button>
                </div>
            </div>
        </div>
    )
}