import { Request, Response } from 'express';
import prisma from '../dataAccess/prisma/prisma'
import { UserResourceBL } from './../businessLogic/userResourceBL';

export class ResearchController {

    public async getData(req: Request, res: Response) {
        const userId = Number(req.params.userId);

        const research = await prisma.research.findMany({
            select: {
                id: true,
                researchCategoryId: true,
                level: true,
                cost: true
            }
        });

        const userResearch = await prisma.userResearch.findMany({
            where: { userId: userId },
            select: { researchId: true }
        });

        return res.json({
            research: research.map(r => ({
                id: r.id,
                category_id: r.researchCategoryId,
                level: r.level,
                cost: r.cost
            })),
            user_research: userResearch.map(ur => ur.researchId)
        });
    }

    public async create(req: Request, res: Response) {
        const researchId = Number(req.params.researchId);
        const userId = Number(req.params.userId);

        const research = await prisma.research.findUnique({ where: { id: researchId } });
        if (!research) return res.status(404).json({ error: "Research not found" });

        // Check previous level
        if (research.level > 1) {
            const previous = await prisma.research.findFirst({
                where: {
                    researchCategoryId: research.researchCategoryId,
                    level: research.level - 1
                }
            });

            const hasPrevious = await prisma.userResearch.findFirst({
                where: { userId, researchId: previous?.id }
            });

            if (!hasPrevious) {
                return res.status(400).json({ error: "You must research the previous level first" });
            }
        }

        // Check if already researched
        const already = await prisma.userResearch.findFirst({
            where: { userId, researchId }
        });
        if (already) return res.status(400).json({ error: "Research already done" });

        // Update user resources
        await UserResourceBL.updateResources(userId);

        const userResource = await prisma.userResource.findUnique({ where: { userId } });
        if (!userResource) return res.status(404).json({ error: "User resources not found" });

        if (research.cost > userResource.researchPoint) {
            return res.status(400).json({ error: "Not enough research points" });
        }

        // Deduct research points
        await prisma.userResource.update({
            where: { userId },
            data: { researchPoint: userResource.researchPoint - research.cost }
        });

        // Insert research
        await prisma.userResearch.create({
            data: { userId, researchId }
        });

        // Special effects
        switch (research.name) {
            case "Holiday":
                const cityIds = await prisma.userCity.findMany({
                    where: { userId },
                    select: { cityId: true }
                });
                await prisma.cityPopulation.updateMany({
                    where: { cityId: { in: cityIds.map(c => c.cityId) } },
                    data: { populationMax: { increment: 50 } }
                });
                break;
            case "Well Digging":
                const capitalCity = await prisma.userCity.findFirst({
                    where: { userId, capital: true },
                    include: { city: true }
                });
                if (capitalCity) {
                    await prisma.cityPopulation.update({
                        where: { cityId: capitalCity.cityId },
                        data: { populationMax: { increment: 50 } }
                    });
                }
                break;
        }

        return res.json("ok");
    }
}