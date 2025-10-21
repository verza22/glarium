import React from "react";

import headerImg from "../../../assets/img/icon/modal_header.jpg";
import closeImg from "../../../assets/img/icon/close.png";
import closeHoverImg from "../../../assets/img/icon/close-hover.png";
import footerImg from "../../../assets/img/icon/bg_maincontentbox_footer.png";
import borderImg from "../../../assets/img/icon/bg_maincontentbox_left.png";

interface WindowLeftProps {
    title: string;
    close: () => void;
    children?: React.ReactNode;
}

const WindowLeft: React.FC<WindowLeftProps> = ({ title, close, children }) => {
    return (
        <div
            className="fixed top-0 z-[100] bg-[beige] w-[720px] mx-auto left-0 right-0 mt-[120px] rounded-lg shadow-lg touch-none"
            style={{
                borderStyle: "solid",
                borderWidth: "0px 3px",
                borderImage: `url(${borderImg}) 0% 50%`,
            }}
        >
            <div
                className="flex items-center justify-between select-noneh-[26px] w-full bg-cover bg-no-repeat rounded-t-lg px-3"
                style={{
                    backgroundImage: `url(${headerImg})`,
                }}
            >
                <div className="text-[12px] leading-none font-bold font-sans text-center flex-1">
                    {title}
                </div>
                <button
                    onClick={close}
                    className={`w-4 h-4 rounded-full ml-2 cursor-pointer bg-[url(${closeImg})] hover:bg-[url(${closeHoverImg})]`}
                />
            </div>

            <div
                className="overflow-y-auto max-h-[75vh] text-[12px] font-normal font-sans leading-none p-[11px] custom-scrollbar"
            >
                {children}
            </div>

            <div
                className="h-[4px] rounded-b-lg bg-cover bg-no-repeat"
                style={{
                    backgroundImage: `url(${footerImg})`,
                }}
            ></div>
        </div>
    );
};

export default WindowLeft;