import {io} from '../http';
import { ConnectionsService } from '../services/ConnectionsServices';
import { MessageService } from '../services/MesssageService';
import { UsersService } from '../services/UsersService';

interface IParams {
    text: string,
    email: string
}

io.on('connection', async (socket) => {
    const connectionsService = new ConnectionsService();
    const usersService = new UsersService();
    const messageService = new MessageService();

    socket.on("client_first_access", async (params) => {
        const socket_id = socket.id;
        const {text, email} = params as IParams;
        let user_id = null;

        const userExists = await usersService.findByEmail(email);

        if (!userExists) {
            const user = await usersService.create(email);
            
            await connectionsService.create({
                socket_id,
                user_id: user.id
            });

            user_id = user.id;

        } else {
            const connection = await connectionsService.findByUserId(userExists.id);

            if (!connection) {
                await connectionsService.create({
                    socket_id,
                    user_id: userExists.id
                })
            } else {
                connection.socket_id = socket_id;
                connection.admin_id = null;
                await connectionsService.create(connection);
                
            }

            user_id = userExists.id;
        }

        await messageService.create({text,user_id});
        
        const allMessages = await messageService.listByUser(user_id);

        socket.emit("client_list_all_messages", allMessages);

        const usersWithoutAdmin = await connectionsService.findAllWithoutAdmin();

        // const connections = {
        //     ...usersWithoutAdmin,
        //     message: allMessages
        // }
        io.emit("admin_list_all_users_without_admin", {usersWithoutAdmin,
            allMessages});
    })

    socket.on("client_send_to_admin", async (params) => {
        const { text, socket_admin_id } = params;

        const socket_id = socket.id;

        const { user_id } = await connectionsService.findBySocketID(socket_id);

        const message = await messageService.create({
            user_id,
            text,
        });

        const { email } = await usersService.findByID(user_id);

        const user = {
            user_id,
            email
        };

        io.to(socket_admin_id).emit("admin_receive_message", {
            message,
            socket_id,
            user
        });

    })
});