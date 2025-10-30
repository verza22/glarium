import React from "react";
import DragToScroll from "../containers/DragToScroll";

import OceanImg from "../assets/img/island/ocean.jpg";
import IslandImg from "../assets/img/island/0.jpg";
import Layout from "../containers/Layout";
import { useParams } from "react-router-dom";
import { useIslandGetInfo } from "../hooks/useIslandGetInfo";
import IslandCities, { City } from "../components/IslandCities";
import IslandResources from "../components/IslandResources";
import { useModal } from "../contexts/ModalContext";
import { ModalType } from "../../../shared/types/others";
import { useGetCurrentCity } from "../hooks/useGetCurrentCity";
import { useUserStore } from "../store/userStore";

const IslandUI: React.FC = () => {

    const { islandId } = useParams<{ islandId: string }>();
    const { data } = useIslandGetInfo(Number(islandId));
    const city = useGetCurrentCity();
    const { name, userId } = useUserStore();
    const { openModal } = useModal();

    const handleDonationModal = (type: boolean) => {
        openModal(ModalType.Donation, {
            info: {
                type,
                island_type: data?.type,
                levelForest: data?.levelForest,
                levelMine: data?.levelMine,
                islandId: Number(islandId),
                cities: data?.cities
            }
        });
    }

    const handleCitiesModal = (targetcity: City) => {
        openModal(ModalType.IslandCity, {
            city: {
                cityId: city?.id,
                name: city?.name,
                user: name,
                userId: userId
            },
            targetCity: {
                cityId: targetcity.cityId,
                name: targetcity.name,
                user: targetcity.user,
                level: targetcity.level,
                userId: targetcity.userId
            }
        });
    }

    const handleColonizeModal = (position: number) => {
        openModal(ModalType.Colonize, {
            position,
            islandId: Number(islandId),
            islandName: data?.name
        });
    }

    return <>
        <Layout />
        <div className="cursor-grab h-full w-full absolute overflow-hidden">
            <DragToScroll className="scroll-container" centerVertical>
                <div
                    className="relative w-[2400px] h-[1800px] bg-cover bg-no-repeat"
                    style={{ backgroundImage: `url(${OceanImg})` }}
                >
                    <div
                        className="absolute top-[430px] left-[500px] w-[1386px] h-[924px] bg-cover bg-no-repeat z-10"
                        style={{ backgroundImage: `url(${IslandImg})` }}
                    >
                        {
                            data && <>
                                <IslandCities
                                    id={data.id}
                                    name={data.name}
                                    x={data.x}
                                    y={data.y}
                                    cities={data.cities}
                                    handleCitiesModal={handleCitiesModal}
                                    handleColonizeModal={handleColonizeModal}
                                />
                                <IslandResources
                                    type={data.type}
                                    islandId={data.id}
                                    levelForest={data.levelForest}
                                    levelMine={data.levelMine}
                                    handleDonationModal={handleDonationModal}
                                />
                            </>
                        }
                    </div>
                </div>
            </DragToScroll>
        </div>
    </>
};

export default IslandUI;