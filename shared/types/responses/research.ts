
export interface IResearch {
    id: number;
    categoryId: number;
    level: number;
    cost: number;
}

export interface ResponseGetResearchData {
    researchList: IResearch[];
    userResearch: number[];
    researchPoint: number;
    researchPointHour: number;
    totalScientists: number;
}