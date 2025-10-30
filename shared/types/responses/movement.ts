
export interface ResponseMovementColonize {
    resources: {
        wood: number;
        marble: number;
        wine: number;
        glass: number;
        sulfur: number;
    };
    userResources: {
        newGold: number;
        newTradeShip: number;
        newTradeAvailableShip: number;
    }
}

export interface ResponseMovementTransport extends ResponseMovementColonize {}
