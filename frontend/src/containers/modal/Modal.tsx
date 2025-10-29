import React, { useEffect, useState } from "react";

import BuildingList, { BuildingsListModalRef } from "./BuildingsModal";
import Building, { BuildingsModalRef, BuildingData } from "./building/Building";
import Donation, { DonationRef, DonationInfo } from "./donation/DonationModal";
import Research from "./research/ResearchModal";
import IslandCity, { IslandCityInfoRef, IslandCityInfo } from "./islandCity/IslandCityModal";
import Messages from "./message/MessageModal";
import Colonize, { ColonizeRef, ColonizeInfo } from "./islandCity/Options/Colonize";
import General from "./general/GeneralModal";
import Mayor from "./Mayor";
import { ModalType } from "../../../../shared/types/others";

export interface ModalRef {
    open: (type: ModalType) => void,
    modal: {
        buildingList: (position: number) => void,
        building: (buildingData: BuildingData) => void,
        donation: (info: DonationInfo) => void,
        colonize: (info: ColonizeInfo) => void,
        islandCity: (info: IslandCityInfo) => void
    }
}

interface ModalProps {
    ref: React.Ref<ModalRef>
}

const Modal: React.FC<ModalProps> = ({ ref }) => {
    const refBuildingList = React.useRef<BuildingsListModalRef>(null);
    const refBuilding = React.useRef<BuildingsModalRef>(null);
    const refDonation = React.useRef<DonationRef>(null);
    const refColonize = React.useRef<ColonizeRef>(null);
    const refIslandCity = React.useRef<IslandCityInfoRef>(null);

    const [visible, setVisible] = React.useState(false);
    const [type, setType] = React.useState<ModalType>(0);

    React.useImperativeHandle(ref, () => ({
        open: (type: ModalType) => {
            setType(type);
            setVisible(true);
        },
        modal: {
            buildingList: (position: number) => refBuildingList.current?.setPosition(position),
            building: (buildingData: BuildingData) => refBuilding.current?.setBuildingData(buildingData),
            donation: (info: DonationInfo) => refDonation.current?.setInfo(info),
            colonize: (info: ColonizeInfo) => refColonize.current?.setInfo(info),
            islandCity: (info: IslandCityInfo) => refIslandCity.current?.setInfo(info)
        }
    }), []);

    const close = () => {
        setVisible(false);
    }

    const modalContent = () => {
        switch (type) {
            case ModalType.BuildingList:
                return <BuildingList close={close} ref={refBuildingList} />;
            case ModalType.Building:
                return <Building close={close} ref={refBuilding} />;
            case ModalType.Donation:
                return <Donation close={close} ref={refDonation} />;
            case ModalType.Research:
                return <Research close={close} />;
            case ModalType.IslandCity:
                return <IslandCity close={close} ref={refIslandCity} />;
            case ModalType.Messages:
                return <Messages close={close} />;
            case ModalType.Colonize:
                return <Colonize close={close} ref={refColonize} />;
            case ModalType.General:
                return <General close={close} />;
            case ModalType.Mayor:
                return <Mayor close={close} />;
            default:
                return null;
        }
    }

    if (visible) {
        return modalContent();
    } else {
        return null;
    }
};

export default Modal;