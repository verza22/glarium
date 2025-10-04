import { Request, Response } from 'express';
import { world } from '../config/world';
import prisma from '../dataAccess/prisma/prisma'
import { RequestUserConfig } from '@shared/types/requests';
import { ResponseUserConfig } from '@shared/types/responses';
import { UserResourceBL } from './../businessLogic/userResourceBL';
import { CityBL } from './../businessLogic/cityBL';

export class UserController {

    // GET /user/config
    public async config(req: Request, res: Response) {
        const userId = (req as Request & RequestUserConfig).id;

        // General config
        const data: ResponseUserConfig = { world: world, research: [], user_research: [] };

        // Research
        data.research = await prisma.research.findMany();

        // User researchs
        const userResearch = await prisma.userResearch.findMany({ where: { userId } });
        data.user_research = userResearch.map(ur => ur.researchId);

        return res.json(data);
    }

    public async getUserResources(req: Request, res: Response) {
        const userId = (req as Request & RequestUserConfig).id;
        await UserResourceBL.updateResources(userId);

        // Get total scientists
        const cities = await prisma.userCity.findMany({
            where: { userId },
            select: { cityId: true }
        });
        const cityIds = cities.map(c => c.cityId);
        const scientistsSum = await prisma.cityPopulation.aggregate({
            where: { cityId: { in: cityIds } },
            _sum: { scientists: true }
        });

        // Get user resources
        const user = await prisma.userResource.findUnique({
            where: { id: userId },
            select: {
                gold: true,
                tradeShip: true,
                tradeShipAvailable: true,
                researchPoint: true
            }
        });

        return res.json({
            ...user,
            total_scientists: scientistsSum._sum.scientists ?? 0
        });
    }

    public async buyTradeShip(req: Request, res: Response) {
        const userId = (req as Request & RequestUserConfig).id;
        await UserResourceBL.updateResources(userId);

        const userResource = await prisma.userResource.findFirst({
            where: { userId }
        });
        if (!userResource) return res.json("User resources not found");

        if (userResource.tradeShip === 200) {
            return res.json("You reached the maximum ship limit");
        }

        const level = userResource.tradeShip + 1;
        let goldCost: number;

        if (level < 10) {
            goldCost = level * 490;
        } else {
            const coef = level / 1000 + 1.8;
            goldCost = Math.floor(Math.pow(level, coef) * (80 + level / 10));
        }

        if (goldCost > userResource.gold) {
            return res.json("Not enough gold");
        }

        await prisma.userResource.update({
            where: { id: userResource.id },
            data: {
                gold: userResource.gold - goldCost,
                tradeShip: userResource.tradeShip + 1,
                tradeShipAvailable: userResource.tradeShipAvailable + 1
            }
        });

        return res.json("ok");
    }

    public async sendMessage(req: Request, res: Response) {
        const { city_from, message, userId } = req.body;
        const cityId = Number(req.params.cityId); // suponiendo que viene en la URL

        // Validation
        if (!city_from || isNaN(city_from) || city_from < 1) {
            return res.json("city_from is required and must be >= 1");
        }
        if (!message || typeof message !== "string" || message.length > 1500) {
            return res.json("message is required and must be <= 1500 characters");
        }

        const cityFrom = await prisma.city.findUnique({ where: { id: city_from } });
        if (!cityFrom) return res.json("City not found");

        // Authorization (placeholder, implement your own)
        // this.authorize('isMyCity', cityFrom)

        const cities = await CityBL.myCities(userId);

        // Recent messages count
        const msgs = await prisma.message.findMany({
            where: {
                cityFromId: { in: cities },
                deletedAtFrom: null,
                createdAt: {
                    gt: new Date(Date.now() - world.messages.time * 1000)
                }
            },
            orderBy: { createdAt: "asc" }
        });

        if (msgs.length >= world.messages.cant) {
            const firstCreated = msgs[0].createdAt.getTime();
            const diff = Math.floor((Date.now() - firstCreated) / 1000);
            const timeWait = world.messages.time - diff;

            let response = `You can send up to ${world.messages.cant}`;
            response += ` messages in ${world.messages.time}s.`;
            response += ` You must wait ${timeWait}s before sending more messages.`;
            return res.json(response);
        }

        // Save message
        await prisma.message.create({
            data: {
                cityFromId: cityFrom.id,
                cityToId: cityId,
                message,
                readed: 0,
                type: 0//??
            }
        });

        // Event (placeholder)
        // await UserNotification.send("advisors", "diplomat", cityId);

        return res.json("ok");
    }

    public async getMessages(req: Request, res: Response) {
        const { type, page, userId } = req.body;

        // Validation
        if (typeof type !== "number" || type < 0 || type > 1) {
            return res.json("type must be 0 or 1");
        }
        if (typeof page !== "number" || page < 0 || page > 999) {
            return res.json("page must be between 0 and 999");
        }

        const cities = await CityBL.myCities(userId);

        const totalNoReaded = await prisma.message.count({
            where: { cityToId: { in: cities }, deletedAtTo: null, readed: 0 }
        });
        const totalReaded = await prisma.message.count({
            where: { cityToId: { in: cities }, deletedAtTo: null, readed: 1 }
        });
        const totalSended = await prisma.message.count({
            where: { cityFromId: { in: cities }, deletedAtFrom: null }
        });

        let data: any = {
            totalNoReaded,
            totalReaded,
            totalSended
        };

        if (type === 0) {
            // Received messages
            const received = await prisma.message.findMany({
                where: { cityToId: { in: cities }, deletedAtTo: null },
                orderBy: { id: "desc" },
                skip: page * 10,
                take: 10,
                include: {
                    cityFrom: {
                        select: {
                            id: true,
                            name: true,
                            islandCity: {
                                select: {
                                    islandId: true,
                                    island: { select: { x: true, y: true } }
                                }
                            },
                            userCities: {
                                select: { user: { select: { id: true, name: true } } }
                            }
                        }
                    }
                }
            });

            const totalReceived = await prisma.message.count({
                where: { cityToId: { in: cities }, deletedAtTo: null }
            });

            data.more = totalReceived > (page + 1) * 10;
            data.received = received.map(m => ({
                id: m.id,
                date: m.createdAt.toISOString().slice(0, 19).replace("T", " "),
                user: m.cityFrom.userCities[0]?.user,
                readed: m.readed,
                city: {
                    id: m.cityFrom.id,
                    name: m.cityFrom.name,
                    island_id: m.cityFrom.islandCity?.islandId,
                    x: m.cityFrom.islandCity?.island.x,
                    y: m.cityFrom.islandCity?.island.y
                },
                message: m.message
            }));
        } else {
            // Sent messages
            const sended = await prisma.message.findMany({
                where: { cityFromId: { in: cities }, deletedAtFrom: null },
                orderBy: { id: "desc" },
                skip: page * 10,
                take: 10,
                include: {
                    cityTo: {
                        select: {
                            id: true,
                            name: true,
                            islandCity: {
                                select: {
                                    islandId: true,
                                    island: { select: { x: true, y: true } }
                                }
                            },
                            userCities: {
                                select: { user: { select: { id: true, name: true } } }
                            }
                        }
                    }
                }
            });

            const totalSendedCount = await prisma.message.count({
                where: { cityFromId: { in: cities }, deletedAtFrom: null }
            });

            data.more = totalSendedCount > (page + 1) * 10;
            data.sended = sended.map(m => ({
                id: m.id,
                date: m.createdAt.toISOString().slice(0, 19).replace("T", " "),
                user: m.cityTo.userCities[0]?.user,
                city: {
                    id: m.cityTo.id,
                    name: m.cityTo.name,
                    island_id: m.cityTo.islandCity?.islandId,
                    x: m.cityTo.islandCity?.island.x,
                    y: m.cityTo.islandCity?.island.y
                },
                message: m.message
            }));
        }

        data.page = page;
        return res.json(data);
    }

    public async deleteMessage(req: Request, res: Response) {
        try {
            const { messages, type, userId } = req.body;

            if (!Array.isArray(messages) || !messages.every((m: any) => Number.isInteger(m))) {
                return res.status(400).json({ error: "messages must be an array of integers" });
            }
            if (typeof type !== "boolean") {
                return res.status(400).json({ error: "type must be a boolean" });
            }

            const cities = await CityBL.myCities(userId);
            const column = type ? "cityFromId" : "cityToId";
            const deleteField = type ? "deletedAtFrom" : "deletedAtTo";

            await prisma.message.updateMany({
                where: {
                    [column]: { in: cities },
                    id: { in: messages }
                },
                data: {
                    [deleteField]: new Date()
                }
            });

            return res.json({ result: "ok" });
        } catch (e) {
            return res.status(500).json({ error: "Internal server error" });
        }
    }

    public async unread(req: Request, res: Response) {
        const userId = (req as Request & RequestUserConfig).id;
        try {
            const cities = await CityBL.myCities(userId);

            const mayor = await prisma.mayor.count({
                where: {
                    cityId: { in: cities },
                    readed: 0
                }
            });

            const message = await prisma.message.count({
                where: {
                    cityToId: { in: cities },
                    deletedAtTo: null,
                    readed: 0
                }
            });

            return res.json({ mayor, message });
        } catch (e) {
            return res.status(500).json({ error: "Internal server error" });
        }
    }

    public async getMayor(req: Request, res: Response) {
        const userId = (req as Request & RequestUserConfig).id;

        const page = Number(req.body.page);
        if (isNaN(page) || page < 0 || page > 999) {
            return res.status(400).json({ error: "page must be 0-999" });
        }

        const cities = await prisma.userCity.findMany({
            where: { userId: userId },
            select: { cityId: true }
        });
        const cityIds = cities.map(c => c.cityId);

        const total = await prisma.mayor.count({ where: { cityId: { in: cityIds } } });

        const items = await prisma.mayor.findMany({
            where: { cityId: { in: cityIds } },
            orderBy: { id: "desc" },
            skip: page * 10,
            take: 10,
            include: { city: { select: { name: true } } }
        });

        await prisma.mayor.updateMany({
            where: { id: { in: items.map(m => m.id) } },
            data: { readed: 1 }
        });

        const data = {
            total,
            items: items.map(m => ({
                fecha: m.createdAt.toISOString().slice(0, 16).replace("T", " "),
                city_id: m.cityId,
                city_name: m.city.name,
                type: m.type,
                readed: m.readed,
                data: m.data
            })),
            more: total > (page + 1) * 10,
            page
        };

        return res.json(data);
    }

    public async readMessage(req: Request, res: Response) {
        const messageId = Number(req.params.id);
        const userId = Number(req.params.userId);
        if (isNaN(messageId)) return res.status(400).json({ error: "Invalid message id" });

        const message = await prisma.message.findUnique({
            where: { id: messageId }
        });
        if (!message) return res.status(404).json({ error: "Message not found" });

        // Authorization placeholder (check if user owns the city)
        const cities = await CityBL.myCities(userId);
        if (!cities.includes(message.cityToId)) {
            return res.status(403).json({ error: "Unauthorized" });
        }

        await prisma.message.update({
            where: { id: messageId },
            data: { readed: 1 }
        });

        return res.json("ok");
    }

    public async readMessages(req: Request, res: Response) {
        const { messages } = req.body;
        const userId = Number(req.params.userId);

        if (!Array.isArray(messages) || !messages.every((m: any) => Number.isInteger(m))) {
            return res.status(400).json({ error: "messages must be an array of integers" });
        }

        const cities = await CityBL.myCities(userId);

        await prisma.message.updateMany({
            where: {
                cityToId: { in: cities },
                id: { in: messages }
            },
            data: { readed: 1 }
        });

        return res.json("ok");
    }
}