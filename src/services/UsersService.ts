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

    async findByEmail(email: string){
        const connection = await this.usersRepository.findOne({email})

        return connection;
    }

    async findByID(id: string){
        const connection = await this.usersRepository.findOne({id})

        return connection;
    }
}

export { UsersService}