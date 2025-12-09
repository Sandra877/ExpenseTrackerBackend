import { Request, Response } from "express";
import * as messageService from "../services/message.service";

export const sendMessage = async (req: Request & { user?: any }, res: Response) => {
  try {
    const result = await messageService.sendMessage(req.user.id, req.body);
    res.status(201).json({ message: "Message sent successfully", id: result.id });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
