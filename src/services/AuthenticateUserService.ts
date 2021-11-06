import { getCustomRepository } from "typeorm";
import { sign } from "jsonwebtoken";
import { compare } from "bcryptjs";
import { UsersRepositories } from "../repositories/UsersRepositories";

interface IAuthenticateUserRequest {
    email: string;
    password: string;
}

class AuthenticateUserService {

  async execute({ email, password }:IAuthenticateUserRequest) {
        const userRepositories = await getCustomRepository(UsersRepositories);

        const user = await userRepositories.findOne({
            where: { email },
        });

        if (!user) {
        throw new Error ('Incorrect email/password combination.');
        }

        const passwordMatched = await compare(password, user.password);

        if (!passwordMatched) {
            throw new Error('Incorrect email/password combination.');
        }

        const token = sign({
            email: user.email,
        }, "secret-token", {
            subject: user.id,
            expiresIn: "1d",
        });
        
        return token;
    }
}

export { AuthenticateUserService };