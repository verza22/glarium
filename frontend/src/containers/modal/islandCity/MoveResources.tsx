import React, { useState } from 'react';
import woodIcon from '../../../assets/img/icon/icon_wood.png';
import wineIcon from '../../../assets/img/icon/icon_wine.png';
import marbleIcon from '../../../assets/img/icon/icon_marble.png';
import glassIcon from '../../../assets/img/icon/icon_glass.png';
import sulfurIcon from '../../../assets/img/icon/icon_sulfur.png';
import { useUserStore } from '../../../store/userStore';
import { useCityStore } from '../../../store/cityStore';

export type Resource = 'wood' | 'wine' | 'marble' | 'glass' | 'sulfur';

type MoveResourcesProps = {
    resources?: Resource[];
    selected: Record<Resource, number>;
    setSelected: React.Dispatch<React.SetStateAction<Record<Resource, number>>>;
    totalSelected: number;
    transport: number;
};

const icons: Record<Resource, string> = {
    wood: woodIcon,
    wine: wineIcon,
    marble: marbleIcon,
    glass: glassIcon,
    sulfur: sulfurIcon,
};

const MoveResources: React.FC<MoveResourcesProps> = ({
    selected,
    setSelected,
    totalSelected,
    transport,
    resources = ['wood', 'wine', 'marble', 'glass', 'sulfur']
}) => {
    const { userResources, resources: cityResources } = useCityStore();
    

    const maxresources = userResources.tradeShipAvailable * transport;

    const updateResource = (res: Resource, newValue: number) => {
        const available = cityResources[res];
        const clampedValue = Math.max(0, Math.min(newValue, available));
        const newTotal = totalSelected - selected[res] + clampedValue;

        if (newTotal > maxresources) {
            const difference = maxresources - (totalSelected - selected[res]);
            setSelected((prev) => ({
                ...prev,
                [res]: Math.max(0, Math.min(difference, available)),
            }));
        } else {
            setSelected((prev) => ({ ...prev, [res]: clampedValue }));
        }
    };

    const handleAdd = (res: Resource) => {
        updateResource(res, selected[res] + transport);
    };

    const handleSubtract = (res: Resource) => {
        updateResource(res, selected[res] - transport);
    };

    const handleChange = (res: Resource, value: string) => {
        const num = parseInt(value.replace(/\D/g, ''), 10) || 0;
        updateResource(res, num);
    };

    return (
        <div className="px-5 space-y-3">
            <div className="text-right text-sm text-gray-700 mb-2">
                Total: {totalSelected.toFixed(0)} / {maxresources.toFixed(0)}
            </div>

            {resources.map((res) => (
                <div key={res} className="flex items-center space-x-3 h-10">
                    <div className="flex-1 flex items-center space-x-2">
                        <img src={icons[res]} alt={res} className="w-6 h-6" />
                        <span className="capitalize">{res}</span>
                        <span className="text-xs text-gray-600">
                            ({cityResources[res].toFixed(0)} availables)
                        </span>
                    </div>

                    <div className="flex-1 flex items-center space-x-2">
                        <button
                            onClick={() => handleSubtract(res)}
                            className="px-3 py-1 border rounded bg-gray-100 hover:bg-gray-200"
                            title="Minimo"
                            disabled={selected[res] <= 0}
                        >
                            -
                        </button>

                        <input
                            type="text"
                            className="border rounded w-20 text-center"
                            value={selected[res]}
                            onChange={(e) => handleChange(res, e.target.value)}
                        />

                        <button
                            onClick={() => handleAdd(res)}
                            className="px-3 py-1 border rounded bg-gray-100 hover:bg-gray-200"
                            title="Maximo"
                            disabled={
                                selected[res] >= cityResources[res] ||
                                totalSelected >= maxresources
                            }
                        >
                            +
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MoveResources;