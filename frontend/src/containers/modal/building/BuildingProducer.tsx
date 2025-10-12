import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import lightGreenImg from '../../../assets/icon/lightgreen.png'
import brownImg from '../../../assets/icon/bar_brown.png'

type Props = {
  data: {
    buildingId: number
    level: number
  }
}

export default function BuildingProducer({ data }: Props) {
  const { t } = useTranslation()
  const [level, setLevel] = useState(0)
  const [workers, setWorkers] = useState(0)
  const [per, setPer] = useState(0)
  const [buildingName, setBuildingName] = useState('')

  // Dummy data
  const dummyWorkers = { 11: 10, 12: 8 }
  const baseResourceBonus = 5

  useEffect(() => {
    const currentLevel = data.level - 1
    setLevel(currentLevel)
    setPer((currentLevel * 2) / 100)

    const name = t(`buildings.${data.buildingId}.name`)
    setBuildingName(name)

    if (data.buildingId === 11) {
      setWorkers(dummyWorkers[11])
    } else {
      setWorkers(dummyWorkers[12])
    }
  }, [data, t])

  const productionBase = baseResourceBonus * workers

  const items = [
    { label: t('modal.building.buildingProducer.productionBase'), value: productionBase, width: 100 - workers * per },
    { label: buildingName, value: productionBase * per, width: workers * per },
    { label: t('modal.building.buildingProducer.total'), value: productionBase + productionBase * per, width: 100 }
  ]

  return (
    <div className="p-3 text-sm">
      <div className="text-center font-semibold mb-3">
        {t('modal.building.buildingProducer.title', { building: buildingName })}
      </div>

      {items.map((item, idx) => (
        <div key={idx} className="flex my-2 items-center">
          <div className="flex-[2] flex items-center">{item.label}:</div>
          <div className="flex-1 flex items-center">{item.value.toFixed(2)}</div>
          <div className="flex-4 h-5 border border-[#c99868] relative bg-gray-200">
            <img src={lightGreenImg} alt="" className="absolute top-0 left-0 h-full w-[100%]" style={{ width: `${item.width}%` }} />
            <img src={brownImg} alt="" className="absolute top-0 left-0 h-full w-full opacity-50" />
          </div>
        </div>
      ))}
    </div>
  )
}