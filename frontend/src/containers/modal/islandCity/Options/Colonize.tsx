import React from 'react';
import { useTranslation } from 'react-i18next';

import WindowLeft from './../../window/WindowLeft';
import TransportReport from './../TransportReport';

type ColonizeProps = {
  info: { name: string };
  close: () => void;
};

const Colonize: React.FC<ColonizeProps> = ({ info, close }) => {
  const { t } = useTranslation();

  // Ejemplo de costos estáticos para UI
  const costGold = 9000;
  const costWood = 5000;
  const costPopulation = 40;

  return (
    <div className="mBorder p-4">
      <WindowLeft close={close} title={t('modal.islandCity.colonizeTitle')}>
        <div className="box space-y-4">
          <div className="text-justify">
            {t('modal.islandCity.colonizeInfo')}
          </div>

          <div className="flex mt-4 mb-2 space-x-4">
            <div className="flex-1 text-center">
              <img src="/Img/ciudad/1.png" alt="Colony" />
            </div>

            <div className="flex-2 flex items-center">
              <div className="requisitos p-4 text-center bg-yellow-50 border border-yellow-200">
                <div className="gtitle mb-2">
                  {t('modal.islandCity.colonizeRequirements')}
                </div>
                <div className="mt-2 flex items-center justify-center space-x-2">
                  <img src="/Img/icon/icon_citizen.png" alt="Population" />
                  <span>{costPopulation}</span>
                </div>
                <div className="mt-2 flex items-center justify-center space-x-2">
                  <img src="/Img/icon/icon_gold.png" alt="Gold" />
                  <span>{costGold}</span>
                </div>
                <div className="mt-2 flex items-center justify-center space-x-2">
                  <img src="/Img/icon/icon_wood.png" alt="Wood" />
                  <span>{costWood}</span>
                </div>
              </div>
            </div>
          </div>

          <TransportReport
            btnTitle={t('modal.islandCity.foundColony')}
            // call={() => {}}
            objetivo={info.name}
            // size={costWood}
            isChangeShip={false}
            // changeShip={() => {}}
          />
        </div>
      </WindowLeft>
    </div>
  );
};

export default Colonize;