import { getCustomRepository, Repository } from "typeorm"
import { User } from "../entities/Users"
import { UsersRepositiry } from "../repositories/UsersRepositiry"


class UsersService {
    private usersRepository: Repository<User>;

    constructor(){
        this.usersRepository = getCustomRepository(UsersRepositiry);
    }
    
    async create(email: string) {
                
        const userExists = await this.usersRepository.findOne({email})
        
        if(userExists){
            const response = {
                resposta: "Usuário já cadastrado",
                ...userExists            
            }
            
            return response
        }

        const user = this.usersRepository.create({email})

        await this.usersRepository.save(user)

        return user;
    }
}

export { UsersService}