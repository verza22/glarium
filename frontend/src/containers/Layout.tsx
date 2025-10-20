import React from "react";
import NavigationLayout from "../components/NavigationLayout";
import Advisors from "./../components/Advisors";
import headerBg from "../assets/img/icon/header_bg.jpg";
import { useTranslation } from "react-i18next";
import packageJson from "../../package.json";
import { useUserStore } from "../store/userStore";
import { useNavigationLayout } from "../hooks/useNavigationLayout";
import { useCityGetInfo } from "../hooks/useCityGetInfo";
import { ModalType } from "../../../shared/types/others";
import { useModal } from "../contexts/ModalContext";

const Layout: React.FC = () => {
    const { t } = useTranslation();
    const navigationLayout = useNavigationLayout();
    const { clearUser, cityId } = useUserStore();
    const { data } = useCityGetInfo(cityId);
    const { openModal } = useModal();

    const hanleAdvisor = (type:  "mayor" | "general" | "scientist" | "diplomat") => {
        switch(type){
            case "mayor":
                openModal(ModalType.Mayor);
            break;
            case "general":
            break;
            case "scientist":
                openModal(ModalType.Research);
            break;
            case "diplomat":
            break;
        }
    }

    return (
        <div className="fixed top-0 left-0 w-full z-20">
            <div
                className="flex justify-center font-medium text-[11px] h-[45px]"
                style={{ backgroundImage: `url(${headerBg})` }}
            >
                <div className="px-6 py-1 cursor-pointer hover:underline">{t("layout.highscore")}</div>
                <div className="px-6 py-1 cursor-pointer hover:underline">{t("layout.options")}</div>
                <div className="px-6 py-1">
                    <a
                        href="https://forum.glarium.com"
                        target="_blank"
                        rel="noreferrer"
                        className="hover:underline"
                    >
                        {t("layout.board")}
                    </a>
                </div>
                <div className="px-6 py-1 cursor-pointer hover:underline" onClick={clearUser}>{t("layout.logout")}</div>
                <div className="px-6 py-1">v{packageJson.version}</div>
                <div className="px-6 py-1 cursor-default relative">
                    <span className="absolute">05/10/2025</span>
                </div>
            </div>

            <div className="relative-bottom-6">
                {
                    data && <NavigationLayout navigationLayout={navigationLayout} data={data}/>
                }
                <Advisors hanleAdvisor={hanleAdvisor} />
            </div>
        </div>
    );
};

export default Layout;