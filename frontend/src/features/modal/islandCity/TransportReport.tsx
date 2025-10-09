import React from 'react';
import { useTranslation } from 'react-i18next';

import shipIcon from '../../../assets/img/icon/ship_transport.png';
import journeyTimeIcon from '../../../assets/img/icon/icon_journeytime.png';
import targetIcon from '../../../assets/img/icon/icon_target2.png';

type TransportReportProps = {
  objetivo: string;
  btnTitle: string;
  isChangeShip?: boolean;
};

const TransportReport: React.FC<TransportReportProps> = ({
  objetivo,
  btnTitle,
  isChangeShip = false,
}) => {
  const { t } = useTranslation();

  return (
    <div>
      <div className="text-center text-lg font-semibold mt-4">
        {t('modal.islandCity.viewReport')}
      </div>

      <div className="flex mt-4 space-x-4">
        <div className="flex-1 flex justify-center items-center space-x-2">
          <img className="max-w-[60px]" src={shipIcon} alt={t('modal.islandCity.ship')} />
          <div>10/20</div>
          {isChangeShip && (
            <input
              type="number"
              className="w-16 px-1 border rounded"
              value={5}
              readOnly
            />
          )}
        </div>

        <div className="flex-1 flex items-center justify-center space-x-2">
          <img src={journeyTimeIcon} alt={t('modal.islandCity.journeyTime')} className="w-5 h-5" />
          <div>
            <div>{t('modal.islandCity.loadTime')}: 00:30</div>
            <div>{t('modal.islandCity.travelTime')}: 01:00</div>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center space-x-2">
          <img src={targetIcon} alt={t('modal.islandCity.target')} className="w-5 h-5" />
          <div>
            {t('modal.islandCity.target')}: {objetivo} ({t('modal.islandCity')})
          </div>
        </div>
      </div>

      <div className="text-center mt-3">
        <button className="px-4 py-2 bg-gray-200 rounded">{btnTitle}</button>
      </div>
    </div>
  );
};

export default TransportReport;