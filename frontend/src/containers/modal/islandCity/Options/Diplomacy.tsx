import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface DiplomacyProps {
    user: string;
    handleSendMessage: (message: string) => void;
}

const Diplomacy: React.FC<DiplomacyProps> = ({ user, handleSendMessage }) => {
    const { t } = useTranslation();
    const [message, setMessage] = useState('');
    const maxLength = 1500;

    const messageLength = maxLength - message.length;

    const submit = () => {
        if (!message || message.trim().length === 0) {
            alert('Message is required');
            return;
        }

        if (message.length < 1) {
            alert('Message must contain at least 1 character');
            return;
        }

        if (message.length > 1500) {
            alert('Message cannot exceed 1500 characters');
            return;
        }

        handleSendMessage(message);
    }

    return (
        <div className="box p-4">
            <div>{t('modal.islandCity.text')}</div>
            <div className="mt-3">
                <div className="my-2">
                    <b>{t('modal.islandCity.receiver')}:</b> {user}
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
                    <div>{messageLength} {t('modal.islandCity.characters')}</div>
                </div>
                <div className="text-center mt-2">
                    <button className="bg-yellow-500 px-6 py-2 cursor-pointer" onClick={submit}>{t('modal.islandCity.send')}</button>
                </div>
            </div>
        </div>
    );
};

export default Diplomacy;