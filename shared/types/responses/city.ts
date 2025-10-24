import { CityFlat, Resources } from "../models";

export interface ResponseCityGetInfo {
    cities: CityFlat[],
    population: {
        population: number,
        populationAvailable: number,
        workerForest: number,
        workerMine: number,
        scientists: number,
        wine: number
    },
    actionPoints: { pointMax: number, point: number },
    resources: Resources,
    userResources: {
        gold: number, 
        tradeShip: number,
        tradeShipAvailable: number
    }
}