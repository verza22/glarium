import React from 'react';
import { useTranslation } from 'react-i18next';

import city from "../../../../assets/img/city/1.png";
import population from "../../../../assets/img/icon/population.png";
import wood from "../../../../assets/img/icon/icon_wood.png";
import gold from "../../../../assets/img/icon/icon_gold.png";

import WindowLeft from './../../window/WindowLeft';
import TransportReport from './../TransportReport';
import { useUserStore } from '../../../../store/userStore';
import { useMovementColonize } from '../../../../hooks/useMovementColonize';

export interface ColonizeInfo {
    position: number;
    islandId: number;
    islandName: string;
}

export interface ColonizeRef {
    setInfo: (info: ColonizeInfo) => void;
}

interface ColonizeProps {
    ref: React.Ref<ColonizeRef>,
    close: () => void;
};

const Colonize: React.FC<ColonizeProps> = ({ close, ref }) => {
    const { t } = useTranslation();
    const [info, setInfo] = React.useState<ColonizeInfo | null>(null);
    const worldConfig = useUserStore(state => state.worldConfig);
    const { mutate: colonize } = useMovementColonize();

    React.useImperativeHandle(ref, () => ({
        setInfo: (info: ColonizeInfo) => setInfo(info)
    }), []);

    if (info === null)
        return null;

    const handleColonize = () => {
        colonize({ position: info.position, islandId: info.islandId }, {
            onSuccess: () => {
                close();
            }
        });
    }

    // Ejemplo de costos estáticos para UI
    const costGold = worldConfig.colonize.gold;
    const costWood = worldConfig.colonize.wood;
    const costPopulation = worldConfig.colonize.population;

    return (
        <div className="mBorder p-4">
            <WindowLeft close={close} title={t('modal.islandCity.colonizeTitle')}>
                <div className="box space-y-4">
                    <div className="text-justify">
                        {t('modal.islandCity.colonizeInfo')}
                    </div>

                    <div className="flex mt-4 mb-2 space-x-4">
                        <div className="flex-1 text-center">
                            <img src={city} className='h-24 w-40' alt="Colony" />
                        </div>

                        <div className="flex-2 flex items-center">
                            <div className="requisitos p-4 text-center bg-yellow-50 border border-yellow-200">
                                <div className="gtitle mb-2">
                                    {t('modal.islandCity.colonizeRequirements')}
                                </div>
                                <div className="mt-2 flex items-center justify-center space-x-2">
                                    <img src={population} alt="Population" />
                                    <span>{costPopulation}</span>
                                </div>
                                <div className="mt-2 flex items-center justify-center space-x-2">
                                    <img src={gold} alt="Gold" />
                                    <span>{costGold}</span>
                                </div>
                                <div className="mt-2 flex items-center justify-center space-x-2">
                                    <img src={wood} alt="Wood" />
                                    <span>{costWood}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <TransportReport
                        btnTitle={t('modal.islandCity.colonizeTitle')}
                        objetivo={info.islandName}
                        isChangeShip={false}
                        handleBtn={handleColonize}
                    />
                </div>
            </WindowLeft>
        </div>
    );
};

export default Colonize;