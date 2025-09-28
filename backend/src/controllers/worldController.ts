import { Request, Response } from 'express';
import prisma from '../dataAccess/prisma/prisma'

export class WorldController {

    public async index(req: Request, res: Response) {
        const x = Number(req.query.x);
        const y = Number(req.query.y);

        if (isNaN(x) || isNaN(y)) {
            return res.status(400).json({ error: "Invalid coordinates" });
        }

        const n = 10;

        const islands = await prisma.island.findMany({
            where: {
                x: { gte: x - n, lte: x + n },
                y: { gte: y - n, lte: y + n }
            },
            include: {
                islandCity: {
                    include: {
                        city: {
                            select: { id: true }
                        }
                    }
                }
            }
        });

        const result = islands.map(i => ({
            id: i.id,
            name: i.name,
            x: i.x,
            y: i.y,
            type: i.type,
            cities: i.islandCity.filter(ic => ic.city).length
        }));

        return res.json(result);
    }
}