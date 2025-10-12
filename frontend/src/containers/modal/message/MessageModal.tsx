import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import WindowLeft from '../window/WindowLeft';
import MessageList from './MessageList';

import scrollClosed from 'Img/icon/schriftrolle_closed.png';
import scrollOpen from 'Img/icon/schriftrolle_offen.png';

type MessageData = {
  totalNoReaded: number;
  totalReaded: number;
  totalSended: number;
  received: any[];
  sended: any[];
  page: number;
  more: boolean;
};

type MessagesProps = {
  info: MessageData;
  close: () => void;
};

const Messages: React.FC<MessagesProps> = ({ info, close }) => {
  const { t } = useTranslation();
  const [type, setType] = useState(0); // 0 = inbox, 1 = outbox
  const [data, setData] = useState<MessageData>(info);

  const messages = type === 0 ? data.received : data.sended;

  const changeType = (newType: number) => {
    setType(newType);
    // In UI-only version, we don't fetch new data
  };
  return (
    <div className="border border-gray-300 p-2">
      <WindowLeft close={close} title={t('advisor.diplomat.title')}>
        <div className="text-sm">
          <div className="flex mb-2">
            <div
              className={`flex-1 justify-center items-center flex p-1 cursor-pointer ${
                type === 0 ? 'bg-yellow-100' : ''
              }`}
              title={t('modal.message.inbox_title')}
              onClick={() => changeType(0)}
            >
              <div
                className="w-4 h-4 inline-block"
                style={{
                  backgroundImage: `url(${type === 0 ? scrollOpen : scrollClosed})`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center',
                }}
              ></div>
              <div className="ml-1">
                {t('modal.message.inbox')} ({data.totalNoReaded}/{data.totalReaded})
              </div>
            </div>

            <div
              className={`flex-1 justify-center items-center flex p-1 cursor-pointer ${
                type === 1 ? 'bg-yellow-100' : ''
              }`}
              title={t('modal.message.outbox_title')}
              onClick={() => changeType(1)}
            >
              <div
                className="w-4 h-4 inline-block"
                style={{
                  backgroundImage: `url(${type === 1 ? scrollOpen : scrollClosed})`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center',
                }}
              ></div>
              <div className="ml-1">
                {t('modal.message.outbox')} ({data.totalSended})
              </div>
            </div>
          </div>

          {messages.length > 0 ? (
            <MessageList
              data={messages}
              type={type}
              page={data.page}
              more={data.more}
            //   nextPage={nextPage}
            //   read={read}
            //   remove={remove}
            />
          ) : (
            <div className="text-center my-5">{t('modal.message.noMessage')}</div>
          )}
        </div>
      </WindowLeft>
    </div>
  );
};

export default Messages;