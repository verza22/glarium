import dayjs from 'dayjs';
import jwt from "jsonwebtoken";

import { RequestUserLogin, RequestUserRegister } from '@shared/types/requests';
import prisma from "../dataAccess/prisma/prisma";
import { JWT_SECRET, JWT_EXPIRES_IN } from "../config/jwtConfig";
import { CityBL } from "./cityBL";


interface GenerateToken {
    userId: number,
    email: string
}

export class UserBL {

    static async login({ email, password }: RequestUserLogin) {
        const user = await prisma.user.findFirst({ where: { email, password } });
        if(!user)
            throw new Error("User doesn't exists");

        const userCity = await prisma.userCity.findFirst({ where: { userId: user.id, capital: true }, include: { city: { include: { islandCity: { include: { island: true } } } } } })
        if(!userCity)
            throw new Error("City doesn't exists");

        const island = userCity.city.islandCity?.island;
        if(!island)
            throw new Error("Island doesn't exists");
        
        const { x, y, id } = island;
        
        return { userId: user.id, cityId: userCity.cityId, islandId: id, x, y, name: user.name };
    }

    static async register({ name, email, password }: RequestUserRegister) {

        const userValidation = await prisma.user.findFirst({ where: { email } });
        if(userValidation)
            throw new Error("User exists");

        //create new account
        const { id: userId } = await prisma.user.create({
            data: {
                name,
                email,
                password
            }
        });

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

        let islandId = 1;
        if (islandsWithCounts.length > 0){
            islandId = islandsWithCounts[0].islandId;
        }

        // Find the first empty position (0-15) in the island
        const positionsTaken = (await prisma.islandCity.findMany({ where: { islandId: islandId } })).map(x => x.position);
        let position = 0;
        for (let i = 0; i < 16; i++) {
            if (!positionsTaken.includes(i)) {
                position = i;
                break;
            }
        }

        const cityId = await CityBL.createCity(userId, islandId, position, true, dayjs().toDate());
        const island = await prisma.island.findFirstOrThrow({ where: { id: islandId } });

        const { x, y } = island;

        return {
            userId,
            cityId,
            islandId,
            x,
            y
        }
    }

    static generateToken({ userId, email }: GenerateToken) {
        return jwt.sign({ userId: userId, email: email }, JWT_SECRET, {
            expiresIn: JWT_EXPIRES_IN
        });
    }
}