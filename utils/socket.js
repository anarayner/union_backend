const users = [];

const getUser = (id) =>{
    return users.find(user => user.id === id)
}
const socketHandler = (io) =>{
    return io.on('connection', (socket) =>{
        console.log('connected')
        io.emit('welcome', 'welcome')

        // all connected users
        socket.on('connectUser', userId =>{
            console.log(socket.id)
            const u = users.find(user => user.id === userId)
            console.log('user: ', u)
            if(u){
                console.log('old socket: ', u.socketId)
                console.log('new socket: ', socket.id)
                u.socketId = socket.id
            } else {
                users.push({id: userId, socketId: socket.id})

            }

            socket.on('disconnect', () => {
                console.log(socket.id)
                console.log( 'a user has left the chat')
                users.filter(user => user.socketId !== socket.id)
            });

            //send message
            socket.on('send_message', ({senderId, receiverId, content, conversationsId, sender})=>{
                const user = getUser(receiverId)
                if(user){
                    console.log(user)
                    console.log({senderId, receiverId, content, conversationsId, sender})
                    console.log(user.socketId)
                    io.to(user.socketId).emit('receive_message', {
                        senderId,
                        receiverId,
                        content,
                        conversationsId,
                        sender
                    })}
            })
        })
        console.log(users)

        // all users events
        io.emit("users", users);
    })
}


exports.socketHandler = socketHandler
