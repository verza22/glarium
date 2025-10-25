import React from 'react'
import TrainUnits, { Unit } from './TrainUnits'
import TrainFormation from './TrainFormation'
import { useCityStore } from '../../../../store/cityStore'
import { useUnitCreate } from '../../../../hooks/useUnitCreate';

interface BarracksProps {
    level: number;
    units: Unit[];
    barracks?: {
        tails: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            constructedAt: Date | null;
            regimentId: number;
            unitId: number;
            cant: number;
            tail: number;
        }[];
        units: {
            cant: number;
            unit_id: number;
            size: number;
        }[];
    } | null;
    close: () => void
}

export default function Barracks({ level, units: unitsProps, barracks, close }: BarracksProps) {

    const [units, setUnits] = React.useState<Unit[]>(unitsProps);
    const { population, resources } = useCityStore();
    const { mutate: handleUnits } = useUnitCreate();

    const handleTrain = () => {
        const unitsAux: number[] = [];
        const cantsAux: number[] = [];

        units.forEach(u => {
            if(u.trainer > 0){
                unitsAux.push(u.id);
                cantsAux.push(u.trainer);
            }
        });

        handleUnits({ units: unitsAux, cants: cantsAux }, {
            onSuccess() {
                close();
            }
        });
    }

    const onChangeTrainer = (unit: Unit, value: number) => {
        const aux = [...units];
        const i = aux.findIndex(u => u.id === unit.id);
        if (i >= 0) {

            if (value < 0)
                value = 0;

            let max = maxTrainer(unit);
            if (value > max)
                value = max;

            aux[i].trainer = value;
            setUnits(aux);
        }
    }

    const onMaxTrainer = (unit: Unit) => {
        let max = maxTrainer(unit);
        onChangeTrainer(unit, max);
    }

    const maxTrainer = (unit: Unit) => {
        var trainer_aux = 0;
        const populationAvailable = population.populationAvailable;

        trainer_aux = Math.floor((populationAvailable - (sum('population') - (unit.trainer * unit.population))) / unit.population);

        var trainer_wood = unit.wood == 0 ? -1 : Math.floor((resources.wood - (sum('wood') - (unit.trainer * unit.wood))) / unit.wood)
        var trainer_wine = unit.wine == 0 ? -1 : Math.floor((resources.wine - (sum('wine') - (unit.trainer * unit.wine))) / unit.wine)
        var trainer_glass = unit.glass == 0 ? -1 : Math.floor((resources.glass - (sum('glass') - (unit.trainer * unit.glass))) / unit.glass)
        var trainer_sulfur = unit.sulfur == 0 ? -1 : Math.floor((resources.sulfur - (sum('sulfur') - (unit.trainer * unit.sulfur))) / unit.sulfur)

        trainer_aux = trainer_wood < trainer_aux && trainer_wood > -1 ? trainer_wood : trainer_aux
        trainer_aux = trainer_wine < trainer_aux && trainer_wine > -1 ? trainer_wine : trainer_aux
        trainer_aux = trainer_glass < trainer_aux && trainer_glass > -1 ? trainer_glass : trainer_aux
        trainer_aux = trainer_sulfur < trainer_aux && trainer_sulfur > -1 ? trainer_sulfur : trainer_aux

        return trainer_aux;
    }

    const sum = (property: 'population' | 'wood' | 'wine' | 'glass' | 'sulfur') => {
        let aux = 0;
        units.forEach(u => {
            aux += u.trainer * u[property];
        });
        return aux;
    }

    const getUnitCount = (unitId: number): number => {
        if (barracks) {
            const i = barracks.units.findIndex(x => x.unit_id === unitId);
            return i >= 0 ? barracks.units[i].cant : 0;
        } else {
            return 0;
        }
    }

    return (
        <div className="text-[0.83rem]">
            <TrainUnits units={units} handleTrain={handleTrain} />
            <TrainFormation
                units={units}
                level={level}
                onChangeTrainer={onChangeTrainer}
                onMaxTrainer={onMaxTrainer}
                getUnitCount={getUnitCount}
            />
        </div>
    )
}