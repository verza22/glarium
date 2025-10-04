import prisma from "../dataAccess/prisma/prisma";
import { Prisma } from "./../dataAccess/prisma/generated/client";
import { City, Island, Movement, UserResource, UserCity } from "@shared/types/models";
import { CombatBL } from "./combatBL";
import { CityBL } from "./cityBL";
// import { UserNotification } from "../events/UserNotification";
import { world } from "../config";
import { Resources } from "@shared/types/others";
import { UnitBL } from "./unitBL";

export class MovementBL {
    public static async loadedSpeed(cityId: number, size: number): Promise<number> {
        let loaded = world.load_speed_base;

        // Get port building (buildingId 16) //Review
        const building = await prisma.city.findFirstOrThrow({ where: { id: cityId }, include: { cityBuildings: { where: { buildingLevelId: 16 }, select: { buildingLevel: true } } } });
        const level = building ? building.cityBuildings[0].buildingLevel.level : 0;

        loaded += level * world.load_speed;
        const loadedPerMinute = loaded / 60;

        return size / loadedPerMinute; // return time in seconds
    }

    public static distanceTime(cityFrom: number, cityTo: number): number {
        // TODO: validate if they are on the same island
        return world.distance.same_island;
    }

    public static distanceTimeColonize(cityFrom: number, islandTo: number): number {
        // TODO: validate if they are on the same island
        return world.distance.same_island;
    }

    public static async getActionPoint(cityFromId: number, userId: number): Promise<number> {
        // Count active movements from a city by user
        return await prisma.movement.count({
            where: { cityFromId: cityFromId, userId: userId },
        });
    }

    public static async returnMovementResources(cityFromId: number): Promise<void> {
        // Return resources for a single city
        const cities = [cityFromId];
        await this.deliveredResourcesFrom(cities);
        await this.deliveredResourcesReturn(cities);
    }

    public static async returnMovementResourcesAll(userId: number): Promise<void> {
        // Get all user cities
        const cities = await prisma.userCity.findMany({
            where: { userId: userId },
            select: { cityId: true },
        }).then(rows => rows.map(r => r.cityId));

        // Execute resource and movement checks
        await this.deliveredResourcesFrom(cities);
        await this.deliveredResourcesReturn(cities);
        await this.deliveredResourcesTo(cities);
        await this.endUserColonize(cities);
        await this.endAttack(userId);
        await this.returnAttack(userId);
    }

    private static async endAttack(userId: number): Promise<void> {
        // Get user attack movements that have ended
        const movements = await prisma.movement.findMany({
            where: {
                userId: userId,
                movementTypeId: 2,
                endAt: { lt: new Date() },
                delivered: false
            },
        });

        // Resolve each attack
        for (const movement of movements) {
            await CombatBL.endAttack(movement.id);
        }
    }

    private static async returnAttack(userId: number): Promise<void> {
        // Get user attack movements that are returning
        const movements = await prisma.movement.findMany({
            where: {
                userId: userId,
                movementTypeId: 2,
                returnAt: { lt: new Date() },
                delivered: true
            },
        });

        // Resolve return for each attack
        for (const movement of movements) {
            await CombatBL.returnAttack(movement.id);
        }
    }

    public static async deliveredResourcesReturn(cities: number[]): Promise<void> {
        const now = new Date();
        const limit = new Date(now.getTime() + 3000); // +3 seconds window

        // Get finished trade movements returning to cities
        const movements = await prisma.movement.findMany({
            where: {
                cityFromId: { in: cities },
                movementTypeId: 1,
                delivered: true,
                returnAt: { lt: limit },
            },
            include: {
                resources: { select: { wood: true, wine: true, marble: true, sulfur: true, glass: true } }
            }
        });

        for (const movement of movements) {
            // Update user trade ships
            const userResource = await prisma.userResource.findFirstOrThrow({
                where: { userId: movement.userId },
            });

            userResource.tradeShipAvailable += movement.tradeShip;
            await prisma.userResource.update({
                where: { id: userResource.id },
                data: { tradeShipAvailable: userResource.tradeShipAvailable }
            });

            if (!movement.resources)
                return;

            let resources: Resources = {
                ...movement.resources
            }

            let data: any;
            if (movement.cancelled === true) {
                // If cancelled, return resources to city
                await CityBL.addResources(movement.cityFromId, resources);
                data = {
                    trade_ship: movement.tradeShip,
                    city_id: movement.cityFromId,
                    resources: {
                        wood: resources.wood,
                        wine: resources.wine,
                        marble: resources.marble,
                        glass: resources.glass,
                        sulfur: resources.sulfur,
                    },
                    status: 4,
                };
            } else {
                // If successful, only notify status
                data = {
                    trade_ship: movement.tradeShip,
                    status: 1,
                };
            }

            // Send notification to user TODO
            //   UserNotification.emit("movements", data, movement.user_id);

            // Delete movement record
            await prisma.movement.delete({
                where: { id: movement.id }
            });
        }
    }

    public static async deliveredResourcesFrom(cities: number[]): Promise<void> {
        const now = new Date();
        const limit = new Date(now.getTime() + 3000); // +3 seconds window

        const movements = await prisma.movement.findMany({
            where: {
                cityFromId: { in: cities },
                movementTypeId: 1,
                delivered: false,
                endAt: { lt: limit },
            },
            include: {
                cityTo: true,
                cityFrom: true,
                resources: true,
                user: true
            },
        });

        for (const movement of movements) {
            const cityTo = movement.cityTo;
            const cityFrom = movement.cityFrom;

            if (!movement.resources)
                break;

            const resources: Resources = { ...movement.resources };

            // Add resources to destination city
            await CityBL.addResources(cityTo.id, resources);

            // Update delivered status
            await prisma.movement.update({
                where: { id: movement.id },
                data: { delivered: true }
            });

            // Insert notification for origin city
            await prisma.mayor.create({
                data: {
                    cityId: cityFrom.id,
                    type: 2,
                    readed: 0,
                    data: JSON.stringify({
                        resources,
                        city_to: cityTo.id,
                        city_name: cityTo.name,
                    }),
                },
            });
            // UserNotification.emit("advisors", "mayor", movement.user_id);

            // Insert notification for destination city
            await prisma.mayor.create({
                data: {
                    cityId: cityTo.id,
                    type: 3,
                    readed: 0,
                    data: JSON.stringify({
                        resources,
                        city_from: cityFrom.id,
                        city_name: cityFrom.name,
                    }),
                },
            });
            // UserNotification.emit("advisors", "mayor", cityTo.userCity.user_id);

            // Notify movement state
            // const data: any = {
            //     city_id: cityTo.id,
            //     resources: {
            //         wood: resources.wood,
            //         wine: resources.wine,
            //         marble: resources.marble,
            //         glass: resources.glass,
            //         sulfur: resources.sulfur,
            //     },
            //     status: 2,
            // };
            // UserNotification.emit("movements", data, cityTo.userCity.user_id);
        }
    }

    // Update resources arriving to a city
    public static async deliveredResourcesTo(cities: number[]): Promise<void> {
        const now = new Date();
        const limit = new Date(now.getTime() + 3000);

        const movements = await prisma.movement.findMany({
            where: {
                cityToId: { in: cities },
                movementTypeId: 1,
                delivered: false,
                endAt: { lt: limit },
            },
            include: { cityTo: true, resources: true },
        });

        for (const movement of movements) {
            const cityTo = movement.cityTo;

            if (!movement.resources)
                break;

            const resources: Resources = { ...movement.resources };

            // Add resources to destination city
            await CityBL.addResources(cityTo.id, resources);

            // Update delivered status
            await prisma.movement.update({
                where: { id: movement.id },
                data: { delivered: true },
            });

            // Notify movement state
            // const updatedMovement = { ...movement, status: 3 };
            // UserNotification.emit("movements", updatedMovement, movement.user_id);
        }
    }

    // Handle colonization end or cancellation
    public static async endUserColonize(cities: number[]): Promise<void> {
        const now = new Date();
        const limit = new Date(now.getTime() + 3000);

        // Successful colonization
        const colonizeMovements = await prisma.movement.findMany({
            where: {
                cityFromId: { in: cities },
                movementTypeId: 4,
                cancelled: false,
                endAt: { lt: limit },
            },
            include: { cityTo: true },
        });
        await this.endColonize(colonizeMovements);

        // Cancelled colonization
        const cancelledMovements = await prisma.movement.findMany({
            where: {
                cityFromId: { in: cities },
                movementTypeId: 4,
                cancelled: true,
                returnAt: { lt: limit },
            },
            include: { cityTo: true, cityFrom: true },
        });
        await this.cancelledColonize(cancelledMovements);
    }

    private static async cancelledColonize(cancelledMovements: Prisma.MovementGetPayload<{ include: { cityTo: true, cityFrom: true } }>[]): Promise<void> {
        for (const movement of cancelledMovements) {
            // Give back ships and gold
            const userResource = await prisma.userResource.findFirstOrThrow({
                where: { userId: movement.userId },
            });
            await prisma.userResource.update({
                where: { id: userResource.id },
                data: {
                    tradeShipAvailable: userResource.tradeShipAvailable + movement.tradeShip,
                    gold: userResource.gold + world.colonize.gold,
                },
            });

            // Return resources
            const cityFrom = movement.cityFrom;
            const collect = UnitBL.newCollect();
            collect.wood = world.colonize.wood;
            await CityBL.addResources(cityFrom.id, collect);

            // Return population
            await prisma.cityPopulation.update({
                where: { cityId: cityFrom.id },
                data: {
                    population: { increment: world.colonize.population },
                },
            });

            // Notify state
            // const data = {
            //     island_id: movement.city_destine.islandCity.island_id,
            //     city_from: movement.city_from,
            //     trade_ship: movement.trade_ship,
            //     status: 5,
            // };
            // UserNotification.emit("movements", data, movement.user_id);

            // Delete movement and destination city
            await prisma.city.delete({ where: { id: movement.cityToId } });
            await prisma.movement.delete({ where: { id: movement.id } });
        }
    }

    private static async endColonize(movements: Prisma.MovementGetPayload<{ include: { cityTo: true } }>[]): Promise<void> {
        for (const movement of movements) {
            // Give back ships
            const userResource = await prisma.userResource.findFirstOrThrow({
                where: { userId: movement.userId },
            });
            await prisma.userResource.update({
                where: { id: userResource.id },
                data: {
                    tradeShipAvailable: userResource.tradeShipAvailable + movement.tradeShip,
                },
            });

            // Mark city as constructed
            await prisma.city.update({
                where: { id: movement.cityTo.id },
                data: { constructedAt: new Date() },
            });

            // Create mayor record
            await prisma.mayor.create({
                data: {
                    cityId: movement.cityTo.id,
                    type: 4,
                    readed: 0,
                    data: JSON.stringify({ city_name: movement.cityTo.name }),
                },
            });
            // UserNotification.emit("advisors", "mayor", movement.user_id);

            // Notify movement state
            // const data = {
            //     island_id: movement.city_destine.islandCity.island_id,
            //     trade_ship: movement.trade_ship,
            //     status: 3,
            // };
            // UserNotification.emit("movements", data, movement.user_id);

            // Delete movement
            await prisma.movement.delete({ where: { id: movement.id } });
        }
    }
}