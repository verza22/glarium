import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import ResourceItem, { ResourceType } from './../../../components/ResourceItem'
import { Resources } from '@shared/types/others'
import { useUserStore } from '../../../store/userStore'

interface WareHouseProps {
    level: number,
    resources: Resources
}

export default function Warehouse({ level, resources }: WareHouseProps) {
    const { t } = useTranslation();
    const worldConfig = useUserStore(state => state.worldConfig);

    const warehouseConfig = {
        capacityBase: worldConfig.warehouse.capacity_base,
        capacityPerLevel: worldConfig.warehouse.capacity,
        resourceProtectedBase: worldConfig.warehouse.resource_protected_base,
        resourceProtectedPerLevel: worldConfig.warehouse.resource_protected
    }

    const maxCapacity = warehouseConfig.capacityBase + (level * warehouseConfig.capacityPerLevel);
    const protectedAmount = warehouseConfig.resourceProtectedBase + level * warehouseConfig.resourceProtectedPerLevel;

    const safeAmount = (amount: number) => (amount > protectedAmount ? amount - protectedAmount : 0)

    const resourcesArray: (keyof Resources)[] = ['wood', 'wine', 'marble', 'glass', 'sulfur']

    return (
        <div className="p-3 text-sm">
            <div className="text-center font-semibold mb-2">{t('modal.building.warehouse.title')}</div>

            <div className="flex text-center bg-yellow-200 py-1">
                <div className="flex-1">{t('modal.building.warehouse.safe')}</div>
                <div className="flex-1">{t('modal.building.warehouse.notSafe')}</div>
                <div className="flex-1">{t('modal.building.warehouse.total')}</div>
                <div className="flex-1">{t('modal.building.warehouse.capacity')}</div>
            </div>

            {resourcesArray.map((type) => (
                <div key={type} className="flex p-1 text-center">
                    <div className="flex-1">
                        <ResourceItem type={type} amount={protectedAmount} />
                    </div>
                    <div className="flex-1">
                        <ResourceItem type={type} amount={safeAmount(resources[type])} />
                    </div>
                    <div className="flex-1">
                        <ResourceItem type={type} amount={resources[type]} />
                    </div>
                    <div className="flex-1">
                        <ResourceItem type={type} amount={maxCapacity} />
                    </div>
                </div>
            ))}
        </div>
    )
}