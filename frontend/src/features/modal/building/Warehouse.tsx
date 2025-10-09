import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import ResourceItem, { ResourceType } from './../../../components/ResourceItem'

type Props = {
  data: {
    level: number
    maximum: boolean
    resources: Record<ResourceType, number>
  }
}

export default function Warehouse({ data }: Props) {
  const { t } = useTranslation()
  const [level, setLevel] = useState(0)
  const [maxCapacity, setMaxCapacity] = useState(0)
  const [protectedAmount, setProtectedAmount] = useState(0)

  // Dummy world warehouse config
  const warehouseConfig = {
    capacityBase: 1000,
    capacityPerLevel: 200,
    resourceProtectedBase: 50,
    resourceProtectedPerLevel: 20
  }

  useEffect(() => {
    const currentLevel = data.maximum ? data.level : data.level - 1
    setLevel(currentLevel)
    setMaxCapacity(warehouseConfig.capacityBase + currentLevel * warehouseConfig.capacityPerLevel)
    setProtectedAmount(
      warehouseConfig.resourceProtectedBase + currentLevel * warehouseConfig.resourceProtectedPerLevel
    )
  }, [data])

  const safeAmount = (amount: number) => (amount > protectedAmount ? amount - protectedAmount : 0)

  const resources: ResourceType[] = ['wood', 'wine', 'marble', 'glass', 'sulfur']

  return (
    <div className="p-3 text-sm">
      <div className="text-center font-semibold mb-2">{t('warehouse.title')}</div>

      <div className="flex text-center bg-yellow-200 py-1">
        <div className="flex-1">{t('warehouse.safe')}</div>
        <div className="flex-1">{t('warehouse.notSafe')}</div>
        <div className="flex-1">{t('warehouse.total')}</div>
        <div className="flex-1">{t('warehouse.capacity')}</div>
      </div>

      {resources.map((type) => (
        <div key={type} className="flex p-1">
          <div className="flex-1">
            <ResourceItem type={type} amount={protectedAmount} />
          </div>
          <div className="flex-1">
            <ResourceItem type={type} amount={safeAmount(data.resources[type])} />
          </div>
          <div className="flex-1">
            <ResourceItem type={type} amount={data.resources[type]} />
          </div>
          <div className="flex-1">
            <ResourceItem type={type} amount={maxCapacity} />
          </div>
        </div>
      ))}
    </div>
  )
}