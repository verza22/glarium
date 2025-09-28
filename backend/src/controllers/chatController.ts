import { Request, Response } from 'express';
import prisma from '../dataAccess/prisma/prisma'

export class ChatController {
    public async send(req: Request, res: Response) {
        const { message, userName } = req.body;
    
        // Validación
        if (!message || typeof message !== "string" || message.length > 50) {
          return res.status(400).json({ error: "Invalid message" });
        }
    
        //TODO websocket notification
        // const data = {
        //   name: userName,
        //   message,
        //   time: new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })
        // };
    
        // // Emitir evento a todos los clientes conectados
        // io.emit("sendMessage", data);
    
        return res.json({ status: "ok" });
      }
    
}