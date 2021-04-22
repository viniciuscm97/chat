import {Request, Response} from "express";
import { getCustomRepository } from "typeorm";
import { SettingsRepository } from "../repositories/SettingsRepository";

class SettingsController {
    async create(req, res){
        const settingsRepository = getCustomRepository(SettingsRepository)
        console.log(req.body)
        const settings = settingsRepository.create({
            chat: req.body.chat,
            username: req.body.username
        })
        await settingsRepository.save(settings)
    
        return res.json(settings)
    }
}

export { SettingsController };