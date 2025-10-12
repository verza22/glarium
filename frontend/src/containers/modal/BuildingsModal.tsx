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

type Building = {
    id: number
    research: boolean
    research_id?: number
    wood?: number
    wine?: number
    marble?: number
    glass?: number
    sulfur?: number
    time?: number
}

type Info = {
    position: number
    data: Building[]
}

type Props = {
    info: Info
    close: () => void
}

export default function BuildingsModal({ info, close }: Props) {
    const { t } = useTranslation()

    return (
        <div className="border rounded p-4">
            <WindowLeft close={close} title={t('building.title')}>
                <div className="text-sm text-justify mb-3">{t('building.text')}</div>

                <div>
                    {info.data.map((build, index) => (
                        <div
                            key={index}
                            className="flex mb-3 pb-3 border-b last:border-b-0 items-center"
                        >
                            <div className="flex-1 flex justify-center">
                                <div className={`build ${!build.research ? 'opacity-40' : ''} building_${build.id}`} />
                            </div>

                            <div className="flex-3 px-3">
                                <div className="font-bold mb-2">{t(`buildings.${build.id}.name`)}</div>
                                <div className="text-sm text-justify mb-2 pb-2 border-b border-red-600">
                                    {t(`buildings.${build.id}.text`)}
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {build.wood && <ResourceItem icon={IconWood} amount={build.wood} />}
                                    {build.wine && <ResourceItem icon={IconWine} amount={build.wine} />}
                                    {build.marble && <ResourceItem icon={IconMarble} amount={build.marble} />}
                                    {build.glass && <ResourceItem icon={IconGlass} amount={build.glass} />}
                                    {build.sulfur && <ResourceItem icon={IconSulfur} amount={build.sulfur} />}
                                    {build.time && <ResourceItem icon={IconTime} amount={build.time} />}
                                </div>
                            </div>

                            <div className="flex-1 flex flex-col items-center justify-center">
                                {build.research ? (
                                    <button className="bg-yellow-500 text-white px-3 py-1 rounded">
                                        {t('building.action')}
                                    </button>
                                ) : (
                                    <div className="text-center text-sm">
                                        <div>{t('building.research')}</div>
                                        <div>{t(`research.${build.research_id}.name`)}</div>
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