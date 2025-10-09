import React from "react";

import headerImg from "./../../assets/img/icon/modal_header.jpg";
import footerImg from "./../../assets/img/icon/bg_maincontentbox_footer.png";
import closeIcon from "./../../assets/img/icon/close.png";

interface ModalProps {
    title: string;
    onClose?: () => void;
    children?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ title, onClose, children }) => {

    const [visible, setVisible] = React.useState(false);

    const handleClose = () => {
        setVisible(false);
        if (onClose) {
            onClose();
        }
    }

    if (!visible)
        return null;

    return (
        <div
            className="fixed left-0 top-0 fixed z-[100] w-[720px] left-0 right-0 mx-auto mt-[120px] touch-none rounded-2xl shadow-lg overflow-hidden bg-[#f5f5dc]"
        >
            <div
                className="cursor-grab h-[26px] w-full flex justify-center items-center relativeselect-none"
                style={{
                    backgroundImage: `url(${headerImg})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "auto",
                }}
            >
                <div className="text-sm font-semibold text-gray-800">{title}</div>
                <button
                    onClick={handleClose}
                    className="absolute right-2 top-[3px] w-[18px] h-[18px] bg-no-repeat bg-center hover:opacity-80 active:scale-95 transition"
                    style={{ backgroundImage: `url(${closeIcon})` }}
                ></button>
            </div>

            <div
                className="overflow-y-auto border-x-[3px] border-solid border-transparenth-[calc(100%-26px)] max-h-[75vh] custom-scroll"
            >
                {children}
            </div>

            <div
                className="h-[4px]"
                style={{ backgroundImage: `url(${footerImg})` }}
            ></div>
        </div>
    );
};

export default Modal;