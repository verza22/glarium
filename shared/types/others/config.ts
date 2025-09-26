export interface WorldConfig {
    transport: number;
    load_speed: number;
    load_speed_base: number;
    load_attack_return: number;
    load_defend_return: number;
    bonus: {
      resources: number;
      tavern: number;
      tavern_consume: number;
    };
    warehouse: {
      resource_protected: number;
      resource_protected_base: number;
      capacity: number;
      capacity_base: number;
    };
    distance: {
      same_island: number;
    };
    combat: {
      wall_bonus: number;
    };
    colonize: {
      wood: number;
      gold: number;
      population: number;
    };
    messages: {
      cant: number;
      time: number;
    };
  }