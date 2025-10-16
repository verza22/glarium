import React from "react";


import headerImg from "../../../assets/img/icon/modal_header.jpg";
import footerImg from "../../../assets/img/icon/bg_maincontentbox_footer.png";
import borderImg from "../../../assets/img/icon/bg_maincontentbox_left.png";

interface WindowRightProps {
    title: string;
    children?: React.ReactNode;
}

const WindowRight: React.FC<WindowRightProps> = ({ title, children }) => {
    return (
        <div
            className="fixed top-0 bg-[beige] z-[100] w-[230px] rounded-lg shadow-lg touch-none left-[-950px] mx-auto mt-[120px]"
            style={{
                borderStyle: "solid",
                borderWidth: "0px 3px",
                borderImage: `url(${borderImg}) 0% 50%`,
                left: "15vw"
            }}
        >

            <div
                className="flex items-center justify-center cursor-grab select-none h-[26px] w-full bg-cover bg-no-repeat rounded-t-lg"
                style={{
                    backgroundImage: `url(${headerImg})`,
                }}
            >
                <div className="text-[12px] leading-none font-bold font-sans text-center">
                    {title}
                </div>
            </div>

            <div
                className="overflow-y-auto max-h-[75vh] text-[12px] font-normal font-sans leading-none p-[11px] custom-scrollbar">
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

export default WindowRight;