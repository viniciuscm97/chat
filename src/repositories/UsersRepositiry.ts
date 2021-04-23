import { EntityRepository, Repository } from "typeorm";
import { User } from "../entities/Users";


@EntityRepository(User)
class UsersRepositiry extends Repository<User>{}

export {UsersRepositiry}