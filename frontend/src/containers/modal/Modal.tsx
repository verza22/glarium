import React, { useEffect, useState } from "react";

import BuildingList, { BuildingsListModalRef, BuildingListInfo } from "./BuildingsModal";
import Building, { BuildingsModalRef, BuildingInfo } from "./building/Building";
import Donation, { DonationRef, DonationInfo } from "./donation/DonationModal";
import Research from "./research/ResearchModal";
import IslandCity from "./islandCity/IslandCityModal";
import Messages, { MessagesRef, MessagesInfo } from "./message/MessageModal";
import Colonize, { ColonizeRef, ColonizeInfo } from "./islandCity/Options/Colonize";
import General, { GeneralModalRef, GeneralModalInfo } from "./general/GeneralModal";
import Mayor from "./Mayor";
import { ModalType } from "../../../../shared/types/others";

export interface ModalRef {
    open: (type: ModalType) => void,
    modal: {
        buildingList: (info: BuildingListInfo) => void,
        building: (info: BuildingInfo) => void,
        donation: (info: DonationInfo) => void,
        messages: (info: MessagesInfo) => void,
        colonize: (info: ColonizeInfo) => void,
        general: (info: GeneralModalInfo) => void
    }
}

interface ModalProps {
    ref: React.Ref<ModalRef>
}

const Modal: React.FC<ModalProps> = ({ ref }) => {
    const refBuildingList = React.useRef<BuildingsListModalRef>(null);
    const refBuilding = React.useRef<BuildingsModalRef>(null);
    const refDonation = React.useRef<DonationRef>(null);
    const refMessages = React.useRef<MessagesRef>(null);
    const refColonize = React.useRef<ColonizeRef>(null);
    const refGeneral = React.useRef<GeneralModalRef>(null);

    const [visible, setVisible] = React.useState(false);
    const [type, setType] = React.useState<ModalType>(0);

    React.useImperativeHandle(ref, () => ({
        open: (type: ModalType) => {
            setType(type);
            setVisible(true);
        },
        modal: {
            buildingList: (info: BuildingListInfo) => refBuildingList.current?.setInfo(info),
            building: (info: BuildingInfo) => refBuilding.current?.setInfo(info),
            donation: (info: DonationInfo) => refDonation.current?.setInfo(info),
            messages: (info: MessagesInfo) => refMessages.current?.setInfo(info),
            colonize: (info: ColonizeInfo) => refColonize.current?.setInfo(info),
            general: (info: GeneralModalInfo) => refGeneral.current?.setInfo(info),
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
                return <IslandCity close={close} />;
            case ModalType.Messages:
                return <Messages close={close} ref={refMessages} />;
            case ModalType.Colonize:
                return <Colonize close={close} ref={refColonize} />;
            case ModalType.General:
                return <General close={close} ref={refGeneral} />;
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