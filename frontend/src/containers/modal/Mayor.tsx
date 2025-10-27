import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import WindowLeft from './window/WindowLeft';
import ResourceItem from '../../components/ResourceItem';

import iconProduction from '../../assets/img/icon/icon_production.png';
import iconTransport from '../../assets/img/icon/icon_transport.png';
import iconMilitary from '../../assets/img/icon/icon_military.png';
import btnMin from '../../assets/img/icon/btn_min.png';
import btnMax from '../../assets/img/icon/btn_max.png';
import { useUserGerMayor } from '../../hooks/useUserGerMayor';
import ResourceList from '../../components/ResourceList';

// Propiedades comunes a todos los items
type Item = {
    readed: number;
    city_id: number;
    city_name: string;
    fecha?: string;
    data: any;
};

type MayorProps = {
    close: () => void;
};

const Mayor: React.FC<MayorProps> = ({ close }) => {
    const { t } = useTranslation();
    const [page, setPage] = useState(0);
    const { data } = useUserGerMayor(page);

    if (!data)
        return null;

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

    const handleNext = () => {
        if(data.more)
            setPage(page + 1);
    }

    const handlePrev = () => {
        if(page >= 0)
            setPage(page - 1);
    }

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
                                        {item.type === 1 ? (
                                            item.data.level === 1 ? (
                                                <div>
                                                    The construction of <b>{t(`buildings.${item.data.building_id}.name`)}</b> has started.
                                                </div>
                                            ) : (
                                                <div>
                                                    <b>{t(`buildings.${item.data.building_id}.name`)}</b> has been upgraded to level{' '}
                                                    <b>{item.data.level}</b>.
                                                </div>
                                            )
                                        ) : item.type === 2 ? (
                                            <div className="space-y-1">
                                                <div>
                                                    Your merchant fleet from <b>{item.city_name}</b> has arrived at <b>{item.data.city_name}</b>{' '}
                                                    and delivered the following goods:
                                                </div>
                                                <ResourceList resources={item.data.resources} />
                                            </div>
                                        ) : item.type === 3 ? (
                                            <div className="space-y-1">
                                                <div>
                                                    A merchant fleet from <b>{item.data.city_name}</b> has arrived at your city{' '}
                                                    <b>{item.city_name}</b> and delivered the following goods:
                                                </div>
                                                <ResourceList resources={item.data.resources} />
                                            </div>
                                        ) : item.type === 4 ? (
                                            <div>
                                                Your city <b>{item.data.city_name}</b> has been founded.
                                            </div>
                                        ) : item.type === 5 ? (
                                            <div>
                                                <div className="mb-2">Unit training has been completed in the Barracks:</div>
                                                <div className="flex space-x-2">
                                                    {item.data.map((unit: any, i: number) => (
                                                        <div key={i} className="text-center">
                                                            <div className={`unit mx-1 unit_${unit.unit_id}`}></div>
                                                            <div className="text-xs">{unit.cant}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : item.type === 6 ? (
                                            <div className="space-y-1">
                                                <div>
                                                    An army from <b>{item.city_name}</b> has arrived at your city{' '}
                                                    <b>{item.data.city_name}</b> and plundered the following goods:
                                                </div>
                                                <ResourceList resources={item.data.resources} />
                                            </div>
                                        ) : item.type === 7 ? (
                                            <div className="space-y-1">
                                                <div>
                                                    Your army that attacked <b>{item.data.city_name}</b> has returned to your city{' '}
                                                    <b>{item.city_name}</b> and brought back the following goods:
                                                </div>
                                                <ResourceList resources={item.data.resources} />
                                            </div>
                                        ) : null}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="text-center mt-2 flex justify-center items-center space-x-4">
                        {data.page >= 1 && (
                            <div className="cursor-pointer" title={t('modal.mayor.prev_10')} onClick={handlePrev}>
                                <img src={btnMin} alt="" />
                            </div>
                        )}
                        <div>
                            {((data.page) * 10) + 1} - {((data.page) * 10) + data.items.length}
                        </div>
                        {data.more && (
                            <div className="cursor-pointer" title={t('modal.mayor.next_10')} onClick={handleNext}>
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