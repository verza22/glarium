export interface RequestIslandGetInfo {
    islandId: number
}

export interface RequestIslandGetData {
    islandId: number,
    type: boolean
}

export interface RequestIslandSetWorker {
    workers: number,
    type: boolean,
    cityId: number
}

export interface RequestIslandSetDonation {
    islandId: number,
    type: boolean,
    cityId: number,
    wood: number
}