import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import TransportReport from './../TransportReport';
import MoveResources, { Resource } from './../MoveResources';
import { useUserStore } from '../../../../store/userStore';
import { useMovementTransport } from '../../../../hooks/useMovementTransport';

interface City {
    name: string;
    id: number;
}

interface TransportProps {
    cityFrom: City;
    cityTo: City;
    close: () => void
}

const Transport: React.FC<TransportProps> = ({ cityFrom, cityTo, close }) => {
    const { t } = useTranslation();
    const { mutate: movementTransport } = useMovementTransport();
    const worldConfig = useUserStore((state) => state.worldConfig);
    const transport = worldConfig.transport;

    const [selected, setSelected] = useState<Record<Resource, number>>({
        wood: 0,
        wine: 0,
        marble: 0,
        glass: 0,
        sulfur: 0,
    });
    const totalSelected = Object.values(selected).reduce((a, b) => a + b, 0);

    const handleBtn = () => {
        movementTransport({
            cityToId: cityTo.id,
            wood: selected.wood,
            wine: selected.wine,
            marble: selected.marble,
            glass: selected.glass,
            sulfur: selected.sulfur
        }, {
            onSuccess: () => {
                close();
            }
        });
    }

    return (
        <div className="p-4">
            <div className="text-justify mb-3">
                {t('modal.islandCity.transport', { cityFrom: cityFrom.name, cityTo: cityTo.name })}
            </div>
            <MoveResources
                selected={selected}
                setSelected={setSelected}
                totalSelected={totalSelected}
                transport={transport}
            />
            <TransportReport
                btnTitle={t('modal.islandCity.send')}
                objetivo={cityTo.name}
                handleBtn={handleBtn}
                tradeShip={Math.ceil(totalSelected / transport)}
            />
        </div>
    );
};

export default Transport;