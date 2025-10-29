import React from 'react';
import { useTranslation } from 'react-i18next';

import shipIcon from '../../../assets/img/icon/ship_transport.png';
import journeyTimeIcon from '../../../assets/img/icon/icon_journeytime.png';
import targetIcon from '../../../assets/img/icon/icon_target2.png';
import { useUserStore } from '../../../store/userStore';

type TransportReportProps = {
  objetivo: string;
  btnTitle: string;
  isChangeShip?: boolean;
  handleBtn?: () => void
};

const TransportReport: React.FC<TransportReportProps> = ({
  objetivo,
  btnTitle,
  isChangeShip = false,
  handleBtn = () => {}
}) => {
  const { t } = useTranslation();
  const worldConfig = useUserStore(state=> state.worldConfig);

  return (
    <div>
      <div className="text-center text-lg font-semibold mt-4">
        {t('modal.islandCity.viewReport')}
      </div>

      <div className="flex mt-4 space-x-4">
        <div className="flex-1 flex justify-center items-center space-x-2">
          <img className="max-w-[60px]" src={shipIcon} alt={t('modal.islandCity.ship')} />
          <div>3/20</div>
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
            <div>{t('modal.islandCity.loadTime')}: {(worldConfig.load_speed_base).toFixed(0)}s</div>
            <div>{t('modal.islandCity.travelTime')}: {(worldConfig.distance.same_island).toFixed(0)}s</div>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center space-x-2">
          <img src={targetIcon} alt={t('modal.islandCity.target')} className="w-5 h-5" />
          <div>
            {t('modal.islandCity.target')}: {objetivo}
          </div>
        </div>
      </div>

      <div className="text-center mt-3">
        <button className="px-4 py-2 bg-yellow-500 rounded cursor-pointer" onClick={()=> handleBtn()}>{btnTitle}</button>
      </div>
    </div>
  );
};

export default TransportReport;