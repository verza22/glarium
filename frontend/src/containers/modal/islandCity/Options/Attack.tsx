import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import TransportReport from './../TransportReport';
import { useGetUnitCity } from '../../../../hooks/useGetUnitCity';

import unit1 from '../../../../assets/img/unit/1.png'
import unit2 from '../../../../assets/img/unit/2.png'
import unit3 from '../../../../assets/img/unit/3.png'
import unit4 from '../../../../assets/img/unit/4.png'
import unit5 from '../../../../assets/img/unit/5.png'
import unit6 from '../../../../assets/img/unit/6.png'
import { useCityStore } from '../../../../store/cityStore';
import { useCombatMovement } from '../../../../hooks/useCombatMovement';

const unitImages: Record<number, string> = {
    1: unit1,
    2: unit2,
    3: unit3,
    4: unit4,
    5: unit5,
    6: unit6
}

interface Unit {
    unit_id: number;
    cant: number;//TODO calc the total cant of units for trade ship reserved space
    size: number;
    cant_aux?: number;
};

interface AttackProps {
    targetCityName: string;
    targetCityId: number;
    changeType?: (type: number) => void;
    close: () => void;
};

const Attack: React.FC<AttackProps> = ({ targetCityName, targetCityId, close }) => {
    const { t } = useTranslation();
    const { data } = useGetUnitCity();
    const { mutate: combatMovement } = useCombatMovement();

    const [units, setUnits] = useState<Unit[]>([]);

    useEffect(() => {
        if (data) {
            setUnits(data.units);
        }
    }, [data]);

    const handleUnitChange = (index: number, value: number) => {
        const newUnits = [...units];

        if (value < 0)
            value = 0;
        if (value > newUnits[index].cant)
            value = newUnits[index].cant;

        newUnits[index].cant_aux = value;
        setUnits(newUnits);
    };

    const handleBtn = (ships: number) => {
        const unitsAux = units.map(x => x.unit_id);
        const cantsAux = units.map(x => typeof x.cant_aux === "undefined" ? 0 : x.cant_aux);
        combatMovement({
            cityId: targetCityId,
            tradeShip: ships,
            units: unitsAux,
            cants: cantsAux
        }, {
            onSuccess: () => {
                close();
            }
        });
    }

    return (
        <div className="p-4 space-y-4">
            <p>{t('modal.islandCity.attackInfo')}</p>

            <div className="text-center text-lg font-semibold mb-3">
                {t('modal.islandCity.sendArmy')}
            </div>

            <p>{t('modal.islandCity.attackWarning')}</p>

            <div className="space-y-2 px-3">
                {units.map((unit, i) => (
                    <div key={unit.unit_id} className="flex items-center space-x-3">
                        <div className="flex-1 flex items-center space-x-2">
                            <div className="w-10 h-10 bg-center bg-no-repeat bg-contain" style={{ backgroundImage: `url(${unitImages[unit.unit_id]})` }} />
                            <div className="text-center text-xs mt-1">{unit.cant}</div>
                        </div>
                        <div className="flex items-center">
                            <input
                                type="number"
                                className="border rounded w-16 px-1 py-0.5"
                                value={unit.cant_aux}
                                onChange={(e) =>
                                    handleUnitChange(i, parseInt(e.target.value) || 0)
                                }
                            />
                        </div>
                    </div>
                ))}
            </div>

            <TransportReport
                isChangeShip={true}
                btnTitle={t('modal.islandCity.plunder')}
                objetivo={targetCityName}
                handleBtn={handleBtn}
            />
        </div>
    );
};

export default Attack;