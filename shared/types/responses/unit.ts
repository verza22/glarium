import { Resources } from "../others";

export interface ResponseUnitCreate {
    resources: Resources;
    population: {
        populationAvailable: number;
        population: number;
    };
}

export interface ResponseUnitCity {
    units: {
        cant: number;
        unit_id: number;
        size: number;
    }[];
}