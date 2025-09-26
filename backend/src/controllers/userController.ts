import { Request, Response } from 'express';
import { world } from '../config/world';
import prisma from '../dataAccess/prisma/prisma'
import { RequestUserConfig } from '@shared/types/requests';
import { ResponseUserConfig } from '@shared/types/responses';

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
}