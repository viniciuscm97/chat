const socket = io();
let connectionsUser = [];

socket.on("admin_list_all_users_without_admin", connections => {
    
    connectionsUser = connections;

    document.getElementById("list_users").innerHTML = "";

    let template = document.getElementById("template").innerHTML;
    
    connections.forEach(connection => {
        const rendered = Mustache.render(template, {
            email: connection.user.email,
            id: connection.socket_id
        });

        document.getElementById("list_users").innerHTML += rendered;
    });
});

socket.on("admin_list_all_users", connections => {
    let divHistoric = document.getElementById("historic");
    let usersInHistoric = document.querySelectorAll(".historics_messages")
    
    let userIds = [];
    let usersToAdd = [];
    
    usersInHistoric.forEach(user => userIds.push(user.id));

    connections.forEach(connection => {
        if(userIds.length === 0){
            usersToAdd.push(connection);
        }else{
            let connectionFoundInHistoric = userIds.find(id => id === connection.user_id);
            if(!connectionFoundInHistoric) usersToAdd.push(connection)
        }
    });
    // connectionsUser = connections;

    usersToAdd.forEach(connection => {
        if(connection.admin_id != null){
            const createDiv = document.createElement("div");
            createDiv.className = "historics_messages";
            createDiv.id = connection.user_id;
            createDiv.innerHTML = `<span class="email">${connection.user.email}</span>`
            createDiv.innerHTML += `<button class="btn_atd" onclick="call('${connection.socket_id}')">Entrar</button>`
            createDiv.innerHTML += `<span class="admin_date">${dayjs(
                connection.created_at).format('DD/MM/YYYY HH:mm:ss')}</span>`;

            divHistoric.appendChild(createDiv);
        }
    });
    console.log(connectionsUser)


});

function call(id){
    console.log(id)
    console.log(connectionsUser)
    let connection = connectionsUser.find( connection => connection.socket_id = id);
    console.log(connection.user.email)
    const template = document.getElementById("admin_template").innerHTML;

    const rendered = Mustache.render(template,{
        email: connection.user.email,
        id: connection.user_id
    });

    document.getElementById("supports").innerHTML += rendered;

    const params = {
        user_id: connection.user_id
    };

    socket.emit("admin_user_in_support", params)

    socket.emit("admin_list_messages_by_user", params, messages => {

        const divMessages = document.getElementById(`allMessages${connection.user_id}`)

        messages.forEach( message => {
            const createDiv = document.createElement("div");

            if (message.admin_id === null) {

                createDiv.className = "admin_message_client";

                createDiv.innerHTML = `<span>${connection.user.email}</span>`
                createDiv.innerHTML += `<span>${message.text}</span>`
                createDiv.innerHTML += `<span class="admin_date">${dayjs(
                    message.created_at).format('DD/MM/YYYY HH:mm:ss')}</span>`;
            } else {

                createDiv.className = "admin_message_admin";

                createDiv.innerHTML = `Atendente: <span>${message.text}</span>`
                createDiv.innerHTML += `<span class="admin_date">${dayjs(
                    message.created_at).format('DD/MM/YYYY HH:mm:ss')}</span>`;
            }

            divMessages.appendChild(createDiv);
        })
    })
}

function sendMessage(id) {
    const text = document.getElementById(`send_message_${id}`);

    const params = {
        text: text.value,
        user_id: id
    }
    
    socket.emit('admin_send_message', params);

    const divMessages = document.getElementById(`allMessages${id}`)
    const createDiv = document.createElement("div");
    
    createDiv.className = "admin_message_admin";
    createDiv.innerHTML = `Atendente: <span>${params.text}</span>`
    createDiv.innerHTML += `<span class="admin_date">${dayjs().format('DD/MM/YYYY HH:mm:ss')}</span>`;
    
    divMessages.appendChild(createDiv);

    text.value = '';
    
}

socket.on("admin_receive_message", data => {
    const connection = connectionsUser.find( connection => connection.socket_id = data.socket_id);

    const divMessages = document.getElementById(`allMessages${connection.user_id}`)
    const createDiv = document.createElement("div");
    
    createDiv.className = "admin_message_client";
    createDiv.innerHTML = `<span>${connection.user.email}</span>`
    createDiv.innerHTML += `<span>${data.message.text}</span>`
    createDiv.innerHTML += `<span class="admin_date">${dayjs(
    data.message.created_at).format('DD/MM/YYYY HH:mm:ss')}</span>`;

    divMessages.appendChild(createDiv);

})