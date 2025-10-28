import { Request, Response } from 'express';
import { world } from '../config/world';
import prisma from '../dataAccess/prisma/prisma'
import { RequestUserConfig, RequestUserDeleteMessages, RequestUserGetMayor, RequestUserGetMessages, RequestUserReadMessage, RequestUserSendMessage, RequestUserUnreadOrReadAll } from '@shared/types/requests';
import { ResponseUserBuyTradeShip, ResponseUserConfig, ResponseUserGetMayor } from '@shared/types/responses';
import { UserResourceBL } from './../businessLogic/userResourceBL';
import { CityBL } from './../businessLogic/cityBL';
import { validateFields } from '../utils/validateFields';

export class UserController {

    // GET /user/config
    public async config(req: Request, res: Response) {
        const userId = req.authUser.userId;

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
        const userId = req.authUser.userId;

        await UserResourceBL.updateResources(userId);

        const userResource = await prisma.userResource.findFirst({
            where: { userId }
        });
        if (!userResource) throw new Error("User resources not found");

        if (userResource.tradeShip === 200) {
            throw new Error("You reached the maximum ship limit");
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
            throw new Error("Not enough gold");
        }

        const newGold = userResource.gold - goldCost;
        const newTradeShip = userResource.tradeShip + 1;
        const newTradeAvailableShip = userResource.tradeShipAvailable + 1;

        await prisma.userResource.update({
            where: { id: userResource.id },
            data: {
                gold: newGold,
                tradeShip: newTradeShip,
                tradeShipAvailable: newTradeAvailableShip
            }
        });

        const response: ResponseUserBuyTradeShip = {
            newGold,
            newTradeShip,
            newTradeAvailableShip
        };

        return res.json(response);
    }

    public async sendMessage(req: Request, res: Response) {
        const { cityFromId, message, cityId }: RequestUserSendMessage = validateFields(req, [
            { name: "cityFromId", type: "number", required: true },
            { name: "message", type: "string", required: true },
            { name: "cityId", type: "number", required: true }
        ]);
        const userId = req.authUser.userId;

        // Validation
        if (!cityFromId || isNaN(cityFromId) || cityFromId < 1) {
            throw new Error("cityFromId is required and must be >= 1");
        }
        if (!message || typeof message !== "string" || message.length > 1500) {
            throw new Error("message is required and must be <= 1500 characters");
        }

        const cityFrom = await prisma.city.findUnique({ where: { id: cityFromId } });
        if (!cityFrom) throw new Error("City not found");

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
            throw new Error(response);
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
        const { page, type }: RequestUserGetMessages = validateFields(req, [
            { name: "page", type: "number", required: true },
            { name: "type", type: "number", required: true }
        ]);
        const userId = req.authUser.userId;

        // Validation
        if (typeof type !== "number" || type < 0 || type > 1) {
            throw new Error("type must be 0 or 1");
        }
        if (typeof page !== "number" || page < 0 || page > 999) {
            throw new Error("page must be between 0 and 999");
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

    public async deleteMessages(req: Request, res: Response) {
        const { messages, type }: RequestUserDeleteMessages = validateFields(req, [
            { name: "messages", type: "number[]", required: true },
            { name: "type", type: "boolean", required: true }
        ]);
        const userId = req.authUser.userId;

        if (!Array.isArray(messages) || !messages.every((m: any) => Number.isInteger(m))) {
            throw new Error("messages must be an array of integers");
        }
        if (typeof type !== "boolean") {
            throw new Error("type must be a boolean");
        }

        const cities = await CityBL.myCities(userId);
        const column = type ? "cityFromId" : "cityToId";
        const deleteField = type ? "deletedAtFrom" : "deletedAtTo";

        let whereClause: any;

        //remove all messages
        if (messages.length === 1 && messages[0] === -1) {
            whereClause = { [column]: { in: cities } };
        } else {
            whereClause = {
                [column]: { in: cities },
                id: { in: messages }
            };
        }

        await prisma.message.updateMany({
            where: whereClause,
            data: {
                [deleteField]: new Date()
            }
        });

        return res.json({ result: "ok" });
    }

    public async unreadOrReadAll(req: Request, res: Response) {
        const { readed }: RequestUserUnreadOrReadAll = validateFields(req, [
            { name: "readed", type: "boolean", required: true }
        ]);
        const userId = req.authUser.userId;

        const cities = await CityBL.myCities(userId);

        await prisma.message.updateMany({
            where: {
                OR: [
                    { cityFromId: { in: cities } },
                    { cityToId: { in: cities } }
                ]
            },
            data: { readed: readed ? 1 : 0 }
        });

        return res.json('ok');
    }

    public async getMayor(req: Request, res: Response) {
        const { page }: RequestUserGetMayor = validateFields(req, [
            { name: "page", type: "number", required: true }
        ]);
        const userId = req.authUser.userId;

        if (isNaN(page) || page < 0 || page > 999) {
            throw new Error("page must be 0-999");
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

        const data: ResponseUserGetMayor = {
            total,
            items: items.map(m => ({
                fecha: m.createdAt.toISOString().slice(0, 16).replace("T", " "),
                city_id: m.cityId,
                city_name: m.city.name,
                type: m.type,
                readed: m.readed,
                data: m.data ? JSON.parse(m.data.toString()) : null
            })),
            more: total > (page + 1) * 10,
            page
        };

        return res.json(data);
    }

    public async readMessage(req: Request, res: Response) {
        const { messageId }: RequestUserReadMessage = validateFields(req, [
            { name: "messageId", type: "number", required: true }
        ]);
        const userId = req.authUser.userId;

        if (isNaN(messageId)) throw new Error("Invalid message id");

        const message = await prisma.message.findUnique({
            where: { id: messageId }
        });
        if (!message) throw new Error("Message not found");

        // Authorization placeholder (check if user owns the city)
        const cities = await CityBL.myCities(userId);
        if (!cities.includes(message.cityToId)) {
            throw new Error("Unauthorized");
        }

        await prisma.message.update({
            where: { id: messageId },
            data: { readed: 1 }
        });

        return res.json("ok");
    }
}