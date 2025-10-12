import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import DragToScroll from "../containers/DragToScroll";
import Modal from "../containers/modal/Modal";
import Building, { BuildingPosition } from "../components/Building";
import Layout from "../containers/Layout";
import CityImg from "./../assets/img/city/city.jpg";
import { useParams } from "react-router-dom";
import axios from "./../utils/axios";

const City = () => {
    const { t, i18n } = useTranslation();
    const { cityId } = useParams<{ cityId: string }>();

    const [buildingList] = useState<BuildingPosition[]>([
        { top: 370, left: 1100 },
        { top: 350, left: 740 },
        { top: 258, left: 908 },
        { top: 250, left: 1285 },
        { top: 490, left: 1210 },
        { top: 545, left: 845 },
        { top: 430, left: 1395 },
        { top: 200, left: 1660 },
        { top: 160, left: 1490 },
        { top: 575, left: 1350 },
        { top: 330, left: 1700 },
        { top: 535, left: 1660 },
        { top: 575, left: 1080 },
        { top: 230, left: 700 },
        { top: 685, left: 900 },
    ]);
    console.log("cityID: " + cityId)

    useEffect(() => {
        axios.post("city/getInfo", {
            cityId: Number(cityId)
        })
            .then(res => {
                console.log(res.data)
            })
    }, []);

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
                        <Building buildingList={buildingList} />
                    </div>
                </DragToScroll>
                <Modal title="testing">
                </Modal>
            </div>
        </>
    );
};

export default City;