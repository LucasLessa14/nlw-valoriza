import { getCustomRepository } from "typeorm";
import { ComplimentsRepositories } from "../repositories/ComplimentsRepositories";
import { UsersRepositories } from "../repositories/UsersRepositories";

interface IComplimentRequest {
    tag_id: string;
    user_sender: string;
    user_receiver: string;
    message: string;
}

class CreateComplimentService {
    async execute({ tag_id, user_sender, user_receiver, message }: IComplimentRequest) {
        
        const complementsRepositories = getCustomRepository(ComplimentsRepositories);
        const usersRepositories = getCustomRepository(UsersRepositories);

        const userRecieverExists = await usersRepositories.findOne(user_receiver);

        if (user_sender === user_receiver) {
            throw new Error("You can't send a compliment to yourself");
        }

        if(!userRecieverExists) {
            throw new Error('User receiver not found');
        }

        const compliment = complementsRepositories.create({
            tag_id,
            user_sender,
            user_receiver,
            message
        });

        await complementsRepositories.save(compliment);

        return compliment;
    }
}

export { CreateComplimentService };