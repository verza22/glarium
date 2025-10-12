import React from 'react'
import { useTranslation } from 'react-i18next'

import warningIcon from '../../../../assets/img/icon/townhall_warning.png'

type Props = {
  corruption: number
}

export default function Notice({ corruption }: Props) {
  const { t } = useTranslation()

  return (
    <div>
      <div className="text-center font-semibold mb-2">
        {t('modal.building.notice_title')}
      </div>

      {corruption === 0 ? (
        <div className="my-2">
          {t('modal.building.no_issue')}
        </div>
      ) : (
        <div className="my-2 flex gap-4">
          <div className="flex-1 text-center">
            <img src={warningIcon} alt="warning" className="mx-auto" />
          </div>
          <div className="flex-6">
            <div className="text-red-600 font-semibold mb-1">
              {t('modal.building.corruption_title')}
            </div>
            <div className="text-justify">
              {t('modal.building.corruption_text')}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}