import { useTranslation } from "react-i18next";
import DragToScroll from "../components/DragToScroll";
import Modal from "../features/modal/Modal";
import Building from "../features/city/Building";
import Layout from "../features/layout/Layout";
import CityImg from "./../assets/img/city/city.jpg";

const City = () => {
    const { t, i18n } = useTranslation();

    return (
        <>
            <Layout />
            <div className="cursor-all-scroll h-full w-full absolute overflow-hidden">
                <DragToScroll className="scroll-container">
                    <div
                        className="w-[2460px] h-[1794px] bg-cover bg-no-repeat"
                        style={{
                            backgroundImage: `url(${CityImg})`,
                        }}
                    >
                        <Building />
                    </div>
                </DragToScroll>
                <Modal title="testing">
                </Modal>
            </div>
        </>
    );
};

export default City;