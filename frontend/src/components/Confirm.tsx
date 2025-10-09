import React from "react";
import { useTranslation } from "react-i18next";

interface ConfirmProps<T = any> {
  data: T;
  close: (data: T) => void;
  confirm: (data: T) => void;
}

const Confirm = <T,>({ data, close, confirm }: ConfirmProps<T>) => {
  const { t } = useTranslation();

  return (
    <div className="absolute bg-[#dfc594] text-[#212529] w-52 right-12 top-[-5px] p-2 text-xs">
      <div className="text-left mb-2 font-semibold">{t("text.message")}</div>
      <div className="flex justify-between">
        <button
          onClick={() => close(data)}
          className="bg-white px-3 py-1 rounded shadow hover:bg-gray-100 transition"
        >
          {t("text.cancel")}
        </button>
        <button
          onClick={() => confirm(data)}
          className="bg-gray-800 text-white px-3 py-1 rounded shadow hover:bg-gray-700 transition"
        >
          {t("text.confirm")}
        </button>
      </div>
    </div>
  );
};

export default Confirm;