import { Resources } from "../others";

export interface ResponseUnitCreate {
    resources: Resources;
    population: {
        populationAvailable: number;
        population: number;
    };
}