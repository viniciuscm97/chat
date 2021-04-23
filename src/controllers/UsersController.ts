import { UsersService } from "../services/UsersService";
import {Request, Response} from "express";

class UsersController {
    async create(req: Request, res: Response): Promise<Response> {
        const { email } = req.body;
        const usersService = new UsersService();

        const user = await usersService.create(email);

        return res.json(user);
    }

}

export {UsersController};