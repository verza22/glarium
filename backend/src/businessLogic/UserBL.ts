import prisma from "../dataAccess/prisma/prisma";
import { CityBL } from "./cityBL";
import dayjs from 'dayjs';

export class UserBL {

    // Initialize a new player with resources and first city
    static async newPlayer(userId: number) {
        // Create user resources
        await prisma.userResource.create({
            data: {
                userId,
                gold: 200,
                researchPoint: 0,
                tradeShip: 0,
                tradeShipAvailable: 0,
            }
        });

        // Find the first island with less than 10 cities
        const islandsWithCounts = await prisma.islandCity.groupBy({
            by: ['islandId'],
            _count: { cityId: true },
            having: { cityId: { _count: { lt: 10 } } },
        });

        if (!islandsWithCounts[0]) throw new Error('No available island');

        const islandId = islandsWithCounts[0].islandId;

        // Find the first empty position (0-15) in the island
        const positionsTaken = (await prisma.islandCity.findMany({ where: { islandId: islandId } })).map(x => x.position);
        let position = 0;
        for (let i = 0; i < 16; i++) {
            if (!positionsTaken.includes(i)) {
                position = i;
                break;
            }
        }

        return CityBL.createCity(userId, islandId, position, true, dayjs().toDate());
    }
}