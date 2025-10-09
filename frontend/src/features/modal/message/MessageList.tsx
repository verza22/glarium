import React from 'react';
import { useTranslation } from 'react-i18next';

import btnMin from '../../../assets/img/icon/btn_min.png';
import btnMax from '../../../assets/img/icon/btn_max.png';
import msgIcon from '../../../assets/img/icon/msg.png';

type City = {
  id: number;
  name: string;
  x: number;
  y: number;
};

type User = {
  name: string;
};

type Message = {
  id: number;
  user: User;
  city: City;
  readed: number;
  message: string;
  date: string;
};

type MessageListProps = {
  data: Message[];
  type: number; // 0 = received, 1 = sent
  page: number;
  more: boolean;
};

const MessageList: React.FC<MessageListProps> = ({ data, type, page, more }) => {
  const { t } = useTranslation();

  const isUnread = (msg: Message) => (msg.readed === 0 ? 'font-bold' : '');

  return (
    <div className="mt-3">
      <table className="table-auto w-full border-collapse text-sm" id="tableMessage">
        <thead>
          <tr>
            <th className="w-9"></th>
            <th className="w-18">{t('modal.message.actions')}</th>
            <th>{t('modal.message.receiver')}</th>
            <th>{t('modal.message.subject')}</th>
            <th>{t('modal.message.city')}</th>
            <th className="w-36">{t('modal.message.date')}</th>
          </tr>
        </thead>
        <tbody>
          {data.map((msg) => (
            <tr key={msg.id} className={`${isUnread(msg)} cursor-pointer hover:bg-gray-100`}>
              <td>
                <input type="checkbox" name="check" />
              </td>
              <td className="text-center">
                <div
                  className="inline-block w-4 h-4 bg-no-repeat"
                  style={{ backgroundImage: `url(${msgIcon})`, backgroundPositionY: '0px' }}
                ></div>
              </td>
              <td>{msg.user.name}</td>
              <td>{t('modal.message.message')}</td>
              <td className="go hover:underline cursor-pointer" title={t('modal.message.go_to_city')}>
                {msg.city.name} [{msg.city.x}:{msg.city.y}]
              </td>
              <td>{msg.date}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-2 flex flex-wrap items-center space-x-4">
        {page > 1 && (
          <div className="cursor-pointer" title={t('modal.message.prev_10')}>
            ...{t('modal.message.prev_10')} <img src={btnMin} alt="" className="inline-block" />
          </div>
        )}
        <div>
          {((page - 1) * 10) + 1} - {((page - 1) * 10) + data.length}
        </div>
        {more && (
          <div className="cursor-pointer" title={t('modal.message.next_10')}>
            <img src={btnMax} alt="" className="inline-block" /> {t('modal.message.next_10')}...
          </div>
        )}
      </div>

      <div className="mt-2 flex flex-wrap items-center space-x-2">
        <div className="cursor-pointer hover:underline">{t('modal.message.all')}</div>
        {type === 0 && (
          <>
            <span> | </span>
            <div className="cursor-pointer hover:underline">{t('modal.message.unread')}</div>
            <span> | </span>
            <div className="cursor-pointer hover:underline">{t('modal.message.read')}</div>
          </>
        )}
        <span> | </span>
        <div className="cursor-pointer hover:underline">{t('modal.message.none')}</div>
      </div>

      {type === 0 && (
        <div className="mt-2">
          <button className="px-4 py-2 bg-gray-200 rounded">{t('modal.message.mark_read')}</button>
        </div>
      )}
      <div className="mt-2">
        <button className="px-4 py-2 bg-gray-200 rounded">{t('modal.message.remove')}</button>
      </div>
    </div>
  );
};

export default MessageList;