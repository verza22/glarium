// shared/types/cityPopulation.ts
export interface CityPopulation {
    id: number;
    cityId: number;
    populationMax: number;
    population: number;
    workerForest: number;
    workerMine: number;
    wineMax: number;
    wine: number;
    scientistsMax: number;
    scientists: number;
    createdAt: Date;
    updatedAt: Date;
  }