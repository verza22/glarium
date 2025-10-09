import React from 'react'
import { useTranslation } from 'react-i18next'

import ResourceItem from '../../../../components/ResourceItem'

type ResourceSet = {
  population: number
  wood: number
  wine: number
  glass: number
  sulfur: number
  gold: number
  time: number
}

type Props = {
  unit: ResourceSet
  disabled?: boolean
}

export default function Resources({ unit, disabled = false }: Props) {

  return (
    <div className="flex flex-wrap justify-between items-start">
      <div className="flex flex-1 flex-wrap gap-2">
        <ResourceItem type="population" amount={unit.population} disabled={disabled} />
        <ResourceItem type="wood" amount={unit.wood} disabled={disabled} />
        <ResourceItem type="wine" amount={unit.wine} disabled={disabled} />
        <ResourceItem type="glass" amount={unit.glass} disabled={disabled} />
        <ResourceItem type="sulfur" amount={unit.sulfur} disabled={disabled} />
      </div>
      <div className="flex gap-2">
        <ResourceItem type="gold" amount={unit.gold} disabled={disabled} />
        <ResourceItem type="timec" amount={unit.time} disabled={disabled} />
      </div>
    </div>
  )
}