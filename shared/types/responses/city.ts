import { CityFlat, CityPopulation, Resources } from "../models";

export interface ResponseCityGetInfo {
    cities: CityFlat[],
    population: {
        population: number,
        populationAvailable: number
    },
    actionPoints: { pointMax: number, point: number },
    resources: Resources,
    userResources: {
        gold: number, 
        tradeShip: number,
        tradeShipAvailable: number
    }
}