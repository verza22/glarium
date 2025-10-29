import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import WindowLeft from '../window/WindowLeft';
import MessageList from './MessageList';

import scrollClosed from '../../../assets/img/icon/schriftrolle_closed.png';
import scrollOpen from '../../../assets/img/icon/schriftrolle_offen.png';
import { useUserGetMessages } from '../../../hooks/useUserGetMessages';
import { useUserReadMessage } from '../../../hooks/useUserReadMessage';
import { useUserUnreadOrReadAll } from '../../../hooks/useUserUnreadOrReadAll';
import { useUserDeleteMessages } from '../../../hooks/useUserDeleteMessages';

export interface MessagesInfo {
    totalNoReaded: number;
    totalReaded: number;
    totalSended: number;
    received: any[];
    sended: any[];
    page: number;
    more: boolean;
};

type MessagesProps = {
    close: () => void;
};

const Messages: React.FC<MessagesProps> = ({ close }) => {
    const { t } = useTranslation();
    const [type, setType] = useState(0); // 0 = inbox, 1 = outbox
    const [page, setPage] = useState(0);
    const { data } = useUserGetMessages(page, type);
    const { mutate: readMessage } = useUserReadMessage();
    const { mutate: unreadOrReadAll } = useUserUnreadOrReadAll();
    const { mutate: deleteMessages } = useUserDeleteMessages();

    if (!data)
        return null;

    const messages = data?.received ? data.received : data.sended;

    const handleReadMessage = (messageId: number) => {
        readMessage({ messageId });
    }

    const handleUnreadOrReadAll = (readed: boolean) => {
        unreadOrReadAll({ readed });
    }

    const handleDeleteMessages = (messages: number[]) => {
        if (messages.length > 0) {
            if (messages.length === 0) {
                alert("You must select at least one message.");
            } else if (confirm("Are you sure you want to delete the selected messages?")) {
                deleteMessages({ messages, type: type === 1 });
            }
        } else {
            alert("You must select at least one message");
        }
    }

    const handlePage = (page: number) => {
        setPage(page);
    }

    return (
        <div className="border border-gray-300 p-2">
            <WindowLeft close={close} title={t('advisor.diplomat.title')}>
                <div className="text-sm">
                    <div className="flex mb-2">
                        <div
                            className={`flex-1 justify-center items-center flex p-1 cursor-pointer ${type === 0 ? 'bg-yellow-100' : ''
                                }`}
                            title={t('modal.message.inbox_title')}
                            onClick={() => setType(0)}
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
                            className={`flex-1 justify-center items-center flex p-1 cursor-pointer ${type === 1 ? 'bg-yellow-100' : ''
                                }`}
                            title={t('modal.message.outbox_title')}
                            onClick={() => setType(1)}
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
                            handleReadMessage={handleReadMessage}
                            handleUnreadOrReadAll={handleUnreadOrReadAll}
                            handleDeleteMessages={handleDeleteMessages}
                            totalReceived={data.totalNoReaded + data.totalReaded}
                            totalSended={data.totalSended}
                            handlePage={handlePage}
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