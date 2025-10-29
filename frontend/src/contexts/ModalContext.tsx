import React, { createContext, useContext, useRef } from "react";
import Modal, { ModalRef } from "../containers/modal/Modal";
import { ModalType } from "../../../shared/types/others";

interface ModalContextProps {
    openModal: (type: ModalType, info?: any) => void;
}

const ModalContext = createContext<ModalContextProps>({
    openModal: () => { },
});

export const useModal = () => useContext(ModalContext);

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const modalRef = useRef<ModalRef>(null);

    const openModal = (type: ModalType, info?: any) => {
        modalRef.current?.open(type);

        if (info) {
            setTimeout(() => {
                switch (type) {
                    case ModalType.BuildingList:
                        modalRef.current?.modal.buildingList(info);
                        break;
                    case ModalType.Building:
                        modalRef.current?.modal.building(info);
                        break;
                    case ModalType.Donation:
                        modalRef.current?.modal.donation(info);
                        break;
                    case ModalType.Colonize:
                        modalRef.current?.modal.colonize(info);
                        break;
                    case ModalType.IslandCity:
                        modalRef.current?.modal.islandCity(info);
                        break;
                }
            })
        }
    };

    return (
        <ModalContext.Provider value={{ openModal }}>
            {children}
            <Modal ref={modalRef} />
        </ModalContext.Provider>
    );
};