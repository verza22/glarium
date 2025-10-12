import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import TransportReport from './../TransportReport';
import MoveResources from './../MoveResources';

interface City {
  name: string;
  id: number;
}

interface TransportProps {
  cityFrom: City;
  cityTo: City;
}

const Transport: React.FC<TransportProps> = ({ cityFrom, cityTo }) => {
  const { t } = useTranslation();

  return (
    <div className="p-4">
      <div className="text-justify mb-3">
        {t('modal.islandCity.transport', { cityFrom: cityFrom.name, cityTo: cityTo.name })}
      </div>
      <MoveResources/>
      <TransportReport
        btnTitle={t('modal.islandCity.send')}
        objetivo='test'
        // call={handleSend}
        // objective={cityTo.name}
        // size={size}
      />
    </div>
  );
};

export default Transport;