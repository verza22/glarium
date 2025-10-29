import React from "react";
import NavigationLayout from "../components/NavigationLayout";
import Advisors from "./../components/Advisors";
import headerBg from "../assets/img/icon/header_bg.jpg";
import { useTranslation } from "react-i18next";
import packageJson from "../../package.json";
import { useUserStore } from "../store/userStore";
import { useNavigationLayout } from "../hooks/useNavigationLayout";
import { useCityGetInfoMutation } from "../hooks/useCityGetInfo";
import { ModalType } from "../../../shared/types/others";
import { useModal } from "../contexts/ModalContext";
import { useCityStore } from "../store/cityStore";
import dayjs from 'dayjs';

const Layout: React.FC = () => {
    const { t } = useTranslation();
    const navigationLayout = useNavigationLayout();
    const { clearUser, cityId } = useUserStore();
    const { mutate: cityGetInfo } = useCityGetInfoMutation();
    const city = useCityStore();
    const { openModal } = useModal();

    const formattedDate = dayjs().format('YYYY-MM-DD');

    const hanleAdvisor = (type:  "mayor" | "general" | "scientist" | "diplomat") => {
        switch(type){
            case "mayor":
                openModal(ModalType.Mayor);
            break;
            case "general":
                openModal(ModalType.General);
            break;
            case "scientist":
                openModal(ModalType.Research);
            break;
            case "diplomat":
                openModal(ModalType.Messages);
            break;
        }
    }

    React.useEffect(()=>{
        cityGetInfo(cityId);
    }, [cityId])

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
                        href="https://github.com/verza22/glarium"
                        target="_blank"
                        rel="noreferrer"
                        className="hover:underline"
                    >
                        {t("layout.github")}
                    </a>
                </div>
                <div className="px-6 py-1 cursor-pointer hover:underline" onClick={clearUser}>{t("layout.logout")}</div>
                <div className="px-6 py-1">v{packageJson.version}</div>
                <div className="px-6 py-1 cursor-default">{formattedDate}</div>
            </div>

            <div className="relative-bottom-6">
                {
                    city.cities.length > 0 && <NavigationLayout navigationLayout={navigationLayout} data={city} />
                }
                <Advisors hanleAdvisor={hanleAdvisor} />
            </div>
        </div>
    );
};

export default Layout;