import React from 'react';
import { useTranslation } from 'react-i18next';

import WindowLeft from './window/WindowLeft';
import ResourceItem from '../../components/ResourceItem';

import iconProduction from '../../assets/img/icon/icon_production.png';
import iconTransport from '../../assets/img/icon/icon_transport.png';
import iconMilitary from '../../assets/img/icon/icon_military.png';
import btnMin from '../../assets/img/icon/btn_min.png';
import btnMax from '../../assets/img/icon/btn_max.png';

type UnitData = {
    unit_id: number;
    amount: number;
};

type ResourceData = {
    wood: number;
    wine: number;
    marble: number;
    glass: number;
    sulfur: number;
};

// Propiedades comunes a todos los items
type BaseItem = {
    readed: number;
    city_id: number;
    city_name: string;
    fecha?: string;
};

// Tipos especificos segun el tipo de evento
type ProductionItem = BaseItem & {
    type: 1;
    data: null;
};

type TransportItem = BaseItem & {
    type: 2 | 3;
    data: {
        city_name: string;
        resources: ResourceData;
    };
};

type CityFoundedItem = BaseItem & {
    type: 4;
    data: {
        city_name: string;
    };
};

type MilitaryItem = BaseItem & {
    type: 5;
    data: UnitData[];
};

type BattleItem = BaseItem & {
    type: 6 | 7;
    data: {
        city_name: string;
        resources: ResourceData;
    };
};

// Union final
type Item =
    | ProductionItem
    | TransportItem
    | CityFoundedItem
    | MilitaryItem
    | BattleItem;

type MayorProps = {
    info?: {
        total: number;
        items: Item[];
        page: number;
        more: boolean;
    };
    close: () => void;
};

const Mayor: React.FC<MayorProps> = ({ close }) => {
    const { t } = useTranslation();
    const data: MayorProps["info"] = {
        total: 5,
        page: 1,
        more: false,
        items: [
            {
                type: 1,
                readed: 0,
                city_id: 101,
                city_name: "Atenas",
                fecha: "2025-10-20",
                data: null,
            },
            {
                type: 2,
                readed: 1,
                city_id: 102,
                city_name: "Esparta",
                fecha: "2025-10-19",
                data: {
                    city_name: "Corinto",
                    resources: {
                        wood: 150,
                        wine: 20,
                        marble: 0,
                        glass: 0,
                        sulfur: 5,
                    },
                },
            },
            {
                type: 4,
                readed: 0,
                city_id: 103,
                city_name: "Olimpia",
                fecha: "2025-10-18",
                data: {
                    city_name: "Olimpia",
                },
            },
            {
                type: 5,
                readed: 1,
                city_id: 104,
                city_name: "Micenas",
                fecha: "2025-10-18",
                data: [
                    { unit_id: 1, amount: 10 },
                    { unit_id: 2, amount: 5 },
                    { unit_id: 3, amount: 2 },
                ],
            },
            {
                type: 6,
                readed: 0,
                city_id: 105,
                city_name: "Argos",
                fecha: "2025-10-17",
                data: {
                    city_name: "Troya",
                    resources: {
                        wood: 50,
                        wine: 0,
                        marble: 10,
                        glass: 0,
                        sulfur: 0,
                    },
                },
            },
        ],
    };

    const getIcon = (type: number) => {
        switch (type) {
            case 1:
                return iconProduction;
            case 2:
            case 3:
            case 4:
                return iconTransport;
            case 5:
            case 6:
            case 7:
                return iconMilitary;
            default:
                return '';
        }
    };

    const getActive = (item: Item) => (item.readed === 0 ? 'bg-yellow-100' : '');

    return (
        <div className="border border-gray-300 p-2">
            <WindowLeft close={close} title={t('modal.mayor.title')}>
                <div className="text-sm">
                    <div className="text-center mb-2 font-semibold">
                        {t('modal.mayor.current_events', { total: data.total })}
                    </div>
                    <table className="w-full table-auto border-collapse">
                        <thead>
                            <tr>
                                <th></th>
                                <th>{t('modal.mayor.place')}</th>
                                <th className="w-28">{t('modal.mayor.date')}</th>
                                <th>{t('modal.mayor.subject')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.items.map((item, index) => (
                                <tr key={index} className={getActive(item)}>
                                    <td>
                                        <img src={getIcon(item.type)} alt="" />
                                    </td>
                                    <td
                                        className="cursor-pointer hover:underline font-bold"
                                        title={t('modal.mayor.go_to_city')}
                                    >
                                        {item.city_name}
                                    </td>
                                    <td>{item.fecha}</td>
                                    <td className="space-y-1">
                                        {item.type === 2 || item.type === 3 || item.type === 6 || item.type === 7 ? (
                                            <div className="space-y-1">
                                                <div>
                                                    {item.type === 2 || item.type === 6
                                                        ? t('modal.mayor.merchant_arrived', {
                                                            from: item.city_name,
                                                            to: item.data.city_name,
                                                        })
                                                        : t('modal.mayor.enemy_arrived', {
                                                            from: item.data.city_name,
                                                            to: item.city_name,
                                                        })}
                                                </div>
                                                <div className="flex space-x-1">
                                                    <ResourceItem type="wood" amount={item.data.resources.wood} />
                                                    <ResourceItem type="wine" amount={item.data.resources.wine} />
                                                    <ResourceItem type="marble" amount={item.data.resources.marble} />
                                                    <ResourceItem type="glass" amount={item.data.resources.glass} />
                                                    <ResourceItem type="sulfur" amount={item.data.resources.sulfur} />
                                                </div>
                                            </div>
                                        ) : item.type === 4 ? (
                                            <div>{t('modal.mayor.city_founded', { city: item.data.city_name })}</div>
                                        ) : item.type === 5 ? (
                                            <div>
                                                <div className="mb-2">{t('modal.mayor.units_completed')}</div>
                                                <div className="flex space-x-2">
                                                    {item.data.map((unit: UnitData, i: number) => (
                                                        <div key={i} className="text-center">
                                                            <div className={`unit mx-1 unit_${unit.unit_id}`}></div>
                                                            <div className="text-xs">{unit.amount}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : item.type === 1 ? (
                                            <div>{/* Production messages could go here */}</div>
                                        ) : null}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="text-center mt-2 flex justify-center items-center space-x-4">
                        {data.page > 1 && (
                            <div className="cursor-pointer" title={t('modal.mayor.prev_10')}>
                                <img src={btnMin} alt="" />
                            </div>
                        )}
                        <div>
                            {((data.page - 1) * 10) + 1} - {((data.page - 1) * 10) + data.items.length}
                        </div>
                        {data.more && (
                            <div className="cursor-pointer" title={t('modal.mayor.next_10')}>
                                <img src={btnMax} alt="" />
                            </div>
                        )}
                    </div>
                </div>
            </WindowLeft>
        </div>
    );
};

export default Mayor;