import { getCustomRepository } from "typeorm"
import { UsersRepositiry } from "../repositories/UsersRepositiry"


class UsersService {
    async create(email: string) {
        const usersRepositiry = getCustomRepository(UsersRepositiry)
        
        const userExists = await usersRepositiry.findOne({email})
        
        if(userExists){
            const response = {
                resposta: "Usuário já cadastrado",
                ...userExists            
            }
            
            return response
        }

        const user = usersRepositiry.create({email})

        await usersRepositiry.save(user)

        return user;
    }
}

export { UsersService}