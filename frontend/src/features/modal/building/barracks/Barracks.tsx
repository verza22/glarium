import React from 'react'
import TrainUnits, { ResourceSet, Unit } from './TrainUnits'
import TrainFormation from './TrainFormation'

type Props = {
  data: {
    level: number
    units: Unit[]
    resources: ResourceSet
  }
}

export default function Barracks({ data }: Props) {
  return (
    <div className="text-[0.83rem]">
      <TrainUnits units={data.units} total={data.resources} />
      <TrainFormation level={data.level - 1} />
    </div>
  )
}