import { io } from '../http';

import { ConnectionsService } from '../services/ConnectionsServices';
import { MessageService } from '../services/MesssageService';

io.on("connect", async (socket) => {
    const connectionService = new ConnectionsService();
    const messageService = new MessageService();
    
    const allConnectionWithoutAdmin = await connectionService.findAllWithoutAdmin();

    io.emit("admin_list_all_users_without_admin", allConnectionWithoutAdmin);

    socket.on("admin_list_messages_by_user", async (params,callback) => {
        const { user_id } = params;

        const allMessages = await messageService.listByUser(user_id);
        
        callback(allMessages);
    })

    socket.on("admin_send_message", async (params) => {
        const { user_id, text } = params;

        await messageService.create({
            admin_id: socket.id,
            user_id,
            text
        });

        const { socket_id } = await connectionService.findByUserId(user_id);

        io.to(socket_id).emit("admin_send_to_client", {
            text,
            socket_id: socket.id
        })
    })

    socket.on("admin_user_in_support", async (params) => {
        const { user_id } = params;
        await connectionService.updateAdminID(user_id,socket.id);

        const allConnectionWithoutAdmin = await connectionService.findAllWithoutAdmin();

        io.emit("admin_list_all_users_without_admin", allConnectionWithoutAdmin);
    })

})