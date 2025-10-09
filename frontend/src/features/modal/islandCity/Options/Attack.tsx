import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import TransportReport from './../TransportReport';

type Unit = {
  unit_id: number;
  cant: number;
  cant_aux?: number;
};

type AttackProps = {
  data: {
    city: { name: string };
  };
  changeType?: (type: number) => void;
};

const Attack: React.FC<AttackProps> = ({ data }) => {
  const { t } = useTranslation();
  const [units, setUnits] = useState<Unit[]>([
    { unit_id: 1, cant: 10, cant_aux: 0 },
    { unit_id: 2, cant: 5, cant_aux: 0 },
  ]);
  const [ships, setShips] = useState<number>(0);
  const [size, setSize] = useState<number>(0);

  const changeShip = (ships: number) => setShips(ships);

  const handleUnitChange = (index: number, value: number) => {
    const newUnits = [...units];
    newUnits[index].cant_aux = value;
    setUnits(newUnits);
  };

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
              <div className="mx-2">{unit.cant}</div>
              <div className={`unit unit_${unit.unit_id} w-6 h-6 bg-gray-300`} />
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
        // changeShip={changeShip}
        btnTitle={t('modal.islandCity.plunder')}
        objetivo={data.city.name}
        // size={size}
      />
    </div>
  );
};

export default Attack;