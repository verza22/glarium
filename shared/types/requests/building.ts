export interface RequestBuildingGetInfo {
    cityId: number
}
export interface RequestBuildingAvailable {
    cityId: number,
    position: number
}
export interface RequestBuildingCreate {
    cityId: number,
    position: number,
    buildingId: number
}
