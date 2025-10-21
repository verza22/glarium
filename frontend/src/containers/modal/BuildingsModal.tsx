import React from 'react'
import { useTranslation } from 'react-i18next'
import WindowLeft from './window/WindowLeft'

// Importar imágenes
import IconWood from '../../assets/img/icon/icon_wood.png'
import IconWine from '../../assets/img/icon/icon_wine.png'
import IconMarble from '../../assets/img/icon/icon_marble.png'
import IconGlass from '../../assets/img/icon/icon_glass.png'
import IconSulfur from '../../assets/img/icon/icon_sulfur.png'
import IconTime from '../../assets/img/icon/icon_time.png'
import Building1 from '../../assets/img/city/1.png'
import Building2 from '../../assets/img/city/2.png'
import Building3 from '../../assets/img/city/3.png'
import Building4 from '../../assets/img/city/4.png'
import Building5 from '../../assets/img/city/5.png'
import Building6 from '../../assets/img/city/6.png'
import Building7 from '../../assets/img/city/7.png'
import Building8 from '../../assets/img/city/8.png'
import Building9 from '../../assets/img/city/9.png'
import Building10 from '../../assets/img/city/10.png'
import Building11 from '../../assets/img/city/11.png'
import Building12 from '../../assets/img/city/12.png'
import Building13 from '../../assets/img/city/13.png'
import Building14 from '../../assets/img/city/14.png'
import Building15 from '../../assets/img/city/15.png'
import Building16 from '../../assets/img/city/16.png'
import Building17 from '../../assets/img/city/17.png'
import Building18 from '../../assets/img/city/18.png'
import Building19 from '../../assets/img/city/19.png'

import { useBuildingAvailable } from '../../hooks/useBuildingAvailable'
import { ResponseBuildingAvailable } from '@shared/types/responses'
import { useCityStore } from '../../store/cityStore'
import { useUserStore } from '../../store/userStore'
import { useBuildingCreate } from '../../hooks/useBuildingCreate'

export interface BuildingsListModalRef {
    setPosition: (position: number) => void;
}

interface ModalProps {
    ref: React.Ref<BuildingsListModalRef>,
    close: () => void
}

export default function BuildingsModal({ close, ref }: ModalProps) {
    const { t } = useTranslation();
    const [position, setPosition] = React.useState<number>(0);
    const { data } = useBuildingAvailable(position);
    const { mutate: buildingCreate } = useBuildingCreate();
    const { resources } = useCityStore();

    React.useImperativeHandle(ref, () => ({
        setPosition: (position: number) => {
            setPosition(position);
        }
    }), []);

    const getBuildingImg = (id: number) => {
        switch(id){
            default:
            case 1:
                return Building1;
            case 2:
                return Building2;
            case 3:
                return Building3;
            case 4:
                return Building4;
            case 5:
                return Building5;
            case 6:
                return Building6;
            case 7:
                return Building7;
            case 8:
                return Building8;
            case 9:
                return Building9;
            case 10:
                return Building10;
            case 11:
                return Building11;
            case 12:
                return Building12;
            case 13:
                return Building13;
            case 14:
                return Building14;
            case 15:
                return Building15;
            case 16:
                return Building16;
            case 17:
                return Building17;
            case 18:
                return Building18;
            case 19:
                return Building19;
        }
    }

    const hasResources = (build: ResponseBuildingAvailable) => {
        return resources.wood >= build.wood &&
        resources.marble >= build.marble &&
        resources.glass >= build.glass &&
        resources.wine >= build.wine &&
        resources.sulfur >= build.sulfur;
    }

    const handleBuild = (build: ResponseBuildingAvailable) => {
        buildingCreate({position, buildingId: build.id}, { onSuccess: () => {
            close();
        }});
    }

    return (
        <div className="border rounded p-4">
            <WindowLeft close={close} title={t('modal.building.list_title')}>
                <div className="text-sm text-justify mb-3">{t('modal.building.text')}</div>

                <div>
                    {data && data.map((build, index) => (
                        <div
                            key={index}
                            className="flex mb-3 pb-3 border-b last:border-b-0 items-center"
                        >
                            <div className="flex-1 flex justify-center">
                                <div 
                                    className={`${!build.research ? 'opacity-40' : ''} h-[120px] w-full bg-center bg-no-repeat bg-cover`}
                                    style={{
                                        backgroundImage: `url(${getBuildingImg(build.id)})`
                                    }}
                                />
                            </div>

                            <div className="flex-3 px-3">
                                <div className="font-bold mb-2">{t(`buildings.${build.id}.name`)}</div>
                                <div className="text-sm text-justify mb-2 pb-2 border-b border-red-600">
                                    {t(`buildings.${build.id}.text`)}
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {build.wood > 0 && <ResourceItem icon={IconWood} amount={build.wood} />}
                                    {build.wine > 0 && <ResourceItem icon={IconWine} amount={build.wine} />}
                                    {build.marble > 0 && <ResourceItem icon={IconMarble} amount={build.marble} />}
                                    {build.glass > 0 && <ResourceItem icon={IconGlass} amount={build.glass} />}
                                    {build.sulfur > 0&& <ResourceItem icon={IconSulfur} amount={build.sulfur} />}
                                    {build.time && <ResourceItem icon={IconTime} amount={build.time} />}
                                </div>
                            </div>

                            <div className="flex-1 flex flex-col items-center justify-center">
                                {build.research ? (
                                    hasResources(build) ?
                                        <button className="bg-yellow-500 text-white px-3 py-1 rounded cursor-pointer" onClick={()=> handleBuild(build)}>
                                            {t('modal.building.buildNow')}
                                        </button>
                                    : <div className="text-center text-sm">
                                        <div>{t('modal.building.noResources')}</div>
                                    </div>
                                ) : (
                                    <div className="text-center text-sm">
                                        <div>{t('modal.building.research')}</div>
                                        <div>{t(`research.${build.researchId}.name`)}</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </WindowLeft>
        </div>
    )
}

type ResourceProps = { icon: string; amount: number }

const ResourceItem = ({ icon, amount }: ResourceProps) => (
    <div className="inline-flex items-center mr-2">
        <img src={icon} alt="" className="w-4 h-4 mr-1" />
        <span className="text-sm">{amount}</span>
    </div>
)