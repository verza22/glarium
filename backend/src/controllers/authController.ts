import { Request, Response } from "express";
import { validateFields } from "../utils/validateFields";
import { UserBL } from "../businessLogic/userBL";
import { asyncHandler } from "../utils/asyncHandler";
import { ResponseAuth } from "@shared/types/responses";
import { RequestUserLogin, RequestUserRegister } from "@shared/types/requests";

export class AuthController {

    public async login(req: Request, res: Response) {
        const { email, password } : RequestUserLogin = validateFields(req, [
            { name: "email", type: "string", required: true },
            { name: "password", type: "string", required: true }
        ]);

        const { userId, cityId } = await UserBL.login({ email, password });

        const token = UserBL.generateToken({ userId, email, cityId });

        const response: ResponseAuth = {
            message: "Login success",
            token: `Bearer ${token}`
        };
        res.json(response);
    }

    public register = asyncHandler(async (req: Request, res: Response) => {
        const { name, email, password }: RequestUserRegister = validateFields(req, [
            { name: "name", type: "string", required: true },
            { name: "email", type: "string", required: true },
            { name: "password", type: "string", required: true }
        ]);

        const { userId, cityId } = await UserBL.register({ name, email, password });

        if (userId > 0 && cityId > 0) {
            const token = UserBL.generateToken({ userId, email, cityId });

            const response: ResponseAuth = {
                message: "Register success",
                token: `Bearer ${token}`
            };
            res.json(response);
        } else {
            throw new Error("Register error");
        }
    })
}