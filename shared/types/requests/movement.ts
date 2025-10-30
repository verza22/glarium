export interface RequestMovementColonize {
    islandId: number;
    cityId: number;
    position: number;
}

export interface RequestMovementTransport {
    cityId: number;
    cityToId: number;
    wood: number;
    wine: number;
    marble: number;
    glass: number;
    sulfur: number;
}

export interface RequestMovementRemove {
    movementId: number
}