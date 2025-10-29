import React, { useEffect, useState } from 'react';
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

interface MessageListProps {
    data: Message[];
    type: number; // 0 = received, 1 = sent
    page: number;
    more: boolean;
    handleReadMessage: (messageId: number) => void;
    handleUnreadOrReadAll: (readed: boolean) => void;
    handleDeleteMessages: (messages: number[]) => void;
    totalReceived: number;
    totalSended: number;
    handlePage: (page: number) => void;
}

const MessageList: React.FC<MessageListProps> = ({
    data,
    type,
    page,
    more,
    handleReadMessage,
    handleUnreadOrReadAll,
    handleDeleteMessages,
    totalReceived,
    totalSended,
    handlePage
}) => {
    const { t } = useTranslation();
    const [messageList, setMessageList] = useState<Message[]>(data);
    const [openMessageId, setOpenMessageId] = useState<number | null>(null);
    const [messagesSelected, setMessagesSelected] = useState<number[]>([]);
    const total = type === 0 ? totalReceived : totalSended;

    useEffect(() => {
        setMessageList(data);
    }, [data]);

    const onClickMessage = (msg: Message) => {
        if (openMessageId === msg.id) {
            setOpenMessageId(null);
            return;
        }
        const aux = [...messageList];
        const i = aux.findIndex(x => x.id === msg.id);
        if (i >= 0 && aux[i].readed === 0) {
            aux[i].readed = 1;
            setMessageList(aux);
            handleReadMessage(msg.id);
        }
        setOpenMessageId(msg.id);
    };

    const isUnread = (msg: Message) => (msg.readed === 0 ? 'font-bold' : '');

    const toggleCheckbox = (id: number) => {
        if (messagesSelected.includes(-1)) {
            // Todos estaban seleccionados, ahora reemplazamos -1 por solo este id
            setMessagesSelected([id]);
        } else {
            if (messagesSelected.includes(id)) {
                setMessagesSelected(messagesSelected.filter(m => m !== id));
            } else {
                setMessagesSelected([...messagesSelected, id]);
            }
        }
    };

    const selectAll = () => {
        if (messagesSelected.length === 1 && messagesSelected[0] === -1) {
            setMessagesSelected([]);
        } else {
            setMessagesSelected([-1]);
        }
    };

    const isChecked = (id: number) =>
        messagesSelected.includes(-1) || messagesSelected.includes(id);

    const getTo = () => {
        let to = (page + 1) * 10;
        if (to > total)
            to = total;

        return to;
    }

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
                    {messageList.map((msg) => (
                        <React.Fragment key={msg.id}>
                            <tr
                                className={`${isUnread(msg)} cursor-pointer hover:bg-gray-100`}
                                onClick={() => onClickMessage(msg)}
                            >
                                <td>
                                    <input
                                        type="checkbox"
                                        name="check"
                                        checked={isChecked(msg.id)}
                                        onChange={() => toggleCheckbox(msg.id)}
                                    />
                                </td>
                                <td className="text-center">
                                    <div
                                        className="inline-block w-4 h-4 bg-no-repeat"
                                        style={{ backgroundImage: `url(${msgIcon})`, backgroundPositionY: '0px' }}
                                    ></div>
                                </td>
                                <td>{msg.user.name}</td>
                                <td>{t('modal.message.message')}</td>
                                <td
                                    className="go hover:underline cursor-pointer"
                                    title={t('modal.message.go_to_city')}
                                >
                                    {msg.city.name} [{msg.city.x}:{msg.city.y}]
                                </td>
                                <td>{msg.date}</td>
                            </tr>
                            {openMessageId === msg.id && (
                                <tr className="bg-gray-50">
                                    <td colSpan={6} className="p-3 border-t border-gray-200">
                                        <div className="text-gray-800 whitespace-pre-wrap">{msg.message}</div>
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>

            <div className="mt-2 flex flex-wrap items-center space-x-4">
                {page >= 1 && (
                    <div className="cursor-pointer" title={t('modal.message.prev_10')} onClick={() => handlePage(page - 1)}>
                        {t('modal.message.prev_10')}... <img src={btnMin} alt="" className="inline-block" />
                    </div>
                )}
                <div>
                    {(page * 10) + 1} - {getTo()} of {total}
                </div>
                {more && (
                    <div className="cursor-pointer" title={t('modal.message.next_10')} onClick={() => handlePage(page + 1)}>
                        <img src={btnMax} alt="" className="inline-block" /> {t('modal.message.next_10')}...
                    </div>
                )}
            </div>

            <div className="mt-2 flex flex-wrap items-center space-x-2">
                <div className="cursor-pointer hover:underline" onClick={selectAll}>{t('modal.message.all')}</div>
                {type === 0 && (
                    <>
                        <span> | </span>
                        <div className="cursor-pointer hover:underline" onClick={() => handleUnreadOrReadAll(false)}>{t('modal.message.unread')}</div>
                        <span> | </span>
                        <div className="cursor-pointer hover:underline" onClick={() => handleUnreadOrReadAll(true)}>{t('modal.message.read')}</div>
                    </>
                )}
                <span> | </span>
                <div className="cursor-pointer hover:underline" onClick={() => handleDeleteMessages(messagesSelected)}>{t('modal.message.remove')}</div>
            </div>
        </div>
    );
};

export default MessageList;