import { WorldConfig } from "@shared/types/others";

export const world: WorldConfig = {
    transport: 500, // Transport capacity of merchant ships
    load_speed: 500, // Load per port level
    load_speed_base: 500, // Base load of the port
    load_attack_return: 5, // Time it takes to load resources from a raid
    load_defend_return: 5, // Time it takes to load troops returning from a defense
    bonus: { // Modifiers for resource speed, etc.
      resources: 10,
      tavern: 10,
      tavern_consume: 10,
    },
    warehouse: {
      resource_protected: 400, // Resources protected per warehouse level
      resource_protected_base: 100, // Base resource protection capacity
      capacity: 8000, // Storage capacity per level
      capacity_base: 2500, // Base storage capacity
    },
    distance: {
      same_island: 750//seconds
    },
    combat: {
      wall_bonus: 0.01, // Wall bonus per level, 0.01 is 1%
    },
    colonize: {
      wood: 1250,
      gold: 9000,
      population: 40,
    },
    messages: {
      cant: 5, // Maximum number of messages
      time: 300, // Time in seconds
    },
  };