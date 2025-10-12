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

        const userCity = await prisma.userCity.findFirst({ where: { userId: user.id, capital: true }, include: { city: { include: { islandCity: true } } } })
        if(!userCity)
            throw new Error("City doesn't exists");

        let islandId = userCity.city.islandCity?.islandId;
        if(!islandId)
            throw new Error("Island doesn't exists");
        
        return { userId: user.id, cityId: userCity.cityId, islandId };
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

        return {
            userId,
            cityId,
            islandId
        }
    }

    static generateToken({ userId, email }: GenerateToken) {
        return jwt.sign({ id: userId, email: email }, JWT_SECRET, {
            expiresIn: JWT_EXPIRES_IN
        });
    }
}