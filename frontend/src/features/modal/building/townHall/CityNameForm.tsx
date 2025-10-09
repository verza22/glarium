import React, { useState, FormEvent } from 'react'
import { useTranslation } from 'react-i18next'

type Props = {
  currentName: string
  onSubmit?: (newName: string) => void
}

export default function CityNameForm({ currentName, onSubmit }: Props) {
  const { t } = useTranslation()
  const [name, setName] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (onSubmit) onSubmit(name)
    setName('')
  }

  return (
    <div className="mb-3">
      <form onSubmit={handleSubmit}>
        <div className="text-center font-semibold mb-2">
          {t('modal.building.change_city_name')}
        </div>

        <div className="flex gap-4 mb-3">
          <div className="flex-2 space-y-2">
            <div className="py-1">{t('modal.building.previous_name')}</div>
            <div className="py-1">{t('modal.building.new_name')}</div>
          </div>

          <div className="flex-4 space-y-2">
            <div className="font-semibold py-1">{currentName}</div>
            <div className="py-1">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                maxLength={30}
                className="w-full border rounded px-2 py-1"
              />
            </div>
          </div>
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="btnGeneral px-4 py-2 rounded hover:brightness-110"
          >
            {t('modal.building.accept_name')}
          </button>
        </div>
      </form>
    </div>
  )
}