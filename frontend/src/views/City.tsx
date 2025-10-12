import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import DragToScroll from "../components/DragToScroll";
import Modal from "../features/modal/Modal";
import Building from "../features/city/Building";
import Layout from "../features/layout/Layout";
import CityImg from "./../assets/img/city/city.jpg";
import { useParams } from "react-router-dom";
import axios from "./../utils/axios";


const City = () => {
    const { t, i18n } = useTranslation();
    const { cityId } = useParams<{ cityId: string }>();
    console.log("cityID: "+cityId)

    useEffect(()=>{
        axios.post("city/getInfo",{
            cityId: Number(cityId)
        })
        .then(res=>{
            console.log(res.data)
        })
    },[]);

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