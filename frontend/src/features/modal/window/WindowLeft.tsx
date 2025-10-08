import React from "react";

import headerImg from "@/assets/img/icon/modal_header.jpg";
import footerImg from "@/assets/img/icon/bg_maincontentbox_footer.png";
import borderImg from "@/assets/img/icon/bg_maincontentbox_left.png";

interface WindowLeftProps {
  titulo: string;
  close: () => void;
  children?: React.ReactNode;
}

const WindowLeft: React.FC<WindowLeftProps> = ({ titulo, close, children }) => {
  return (
    <div
      className="
        fixed z-[100] bg-[beige] w-[720px] mx-auto left-0 right-0 mt-[120px]
        rounded-lg shadow-lg touch-none
      "
      style={{
        borderStyle: "solid",
        borderWidth: "0px 3px",
        borderImage: `url(${borderImg}) 0% 50%`,
      }}
    >
      {/* Header */}
      <div
        className="
          flex items-center justify-between cursor-grab select-none
          h-[26px] w-full bg-cover bg-no-repeat rounded-t-lg px-3
        "
        style={{
          backgroundImage: `url(${headerImg})`,
        }}
      >
        <div className="text-[12px] leading-none font-bold font-sans text-center flex-1">
          {titulo}
        </div>
        <button
          onClick={close}
          className="
            w-4 h-4 rounded-full bg-gray-400 hover:bg-gray-600
            transition-all ml-2
          "
        />
      </div>

      {/* Body */}
      <div
        className="
          overflow-y-auto max-h-[75vh]
          text-[12px] font-normal font-sans leading-none p-[11px]
          custom-scrollbar
        "
      >
        {children}
      </div>

      {/* Footer */}
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