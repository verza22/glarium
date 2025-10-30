import { Request, Response } from 'express';
import prisma from '../dataAccess/prisma/prisma'
import { validateFields } from '../utils/validateFields';
import { RequestWorldGetIslands } from '@shared/types/requests';
import { ResponseWorldGetIslands } from '@shared/types/responses';

export class WorldController {

    public async getIslands(req: Request, res: Response) {
        const { x, y }: RequestWorldGetIslands = validateFields(req, [
            { name: "x", type: "number", required: true },
            { name: "y", type: "number", required: true }
        ]);

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
                            select: { id: true, deletedAt: true }
                        }
                    }
                }
            }
        });

        const result: ResponseWorldGetIslands[] = islands.map(i => ({
            id: i.id,
            name: i.name,
            x: i.x,
            y: i.y,
            type: i.type,
            cities: i.islandCity.filter(ic => ic.city && ic.city.deletedAt === null).length
        }));

        return res.json(result);
    }
}