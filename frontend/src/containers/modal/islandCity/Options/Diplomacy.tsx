import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface DiplomacyProps {
  data: {
    city: {
      user: string;
      city_id: number;
    };
  };
  changeType: (type: number) => void;
}

const Diplomacy: React.FC<DiplomacyProps> = ({ data, changeType }) => {
  const { t } = useTranslation();
  const [message, setMessage] = useState('');
  const [error, setError] = useState(false);
  const maxLength = 1500;

  const messageLength = maxLength - message.length;

  return (
    <div className="box p-4">
      <div>{t('modal.islandCity.text')}</div>
      <div className="mt-3">
        <div className="my-2">
          <b>{t('modal.islandCity.receiver')}:</b> {data.city.user}
        </div>
        <div className="my-2">
          <b>{t('modal.islandCity.subject')}:</b> {t('modal.islandCity.message')}
        </div>
        <div className="mt-2">
          <b>{t('modal.islandCity.message')}:</b>
        </div>
        <div>
          <textarea
            className="w-full border rounded p-2"
            rows={10}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          {error && <div className="text-red-600">{t('modal.islandCity.errorMessage')}</div>}
          <div>{messageLength} {t('modal.islandCity.characters')}</div>
        </div>
        <div className="text-center mt-2">
          <button className="btnGeneral px-6 py-2">{t('modal.islandCity.send')}</button>
        </div>
      </div>
    </div>
  );
};

export default Diplomacy;