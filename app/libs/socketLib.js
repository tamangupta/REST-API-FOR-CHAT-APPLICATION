/*
modules dependencies 
 */
const socketio = require('socket.io')
const mongoose = require('mongoose')
const shortid = require('shortid')
const logger = require('./loggerLib')
const events = require('events')
const eventEmitter = new events.EventEmitter()

const tokenLib = require('./tokenLib')
const check = require('./checkLib')
const response = require('./responseLib')
const ChatModel = mongoose.model('Chat')

module.exports.setServer = (server) => {

    let allOnlineUsers = []

    let io = socketio.listen(server);

    let myIo = io.of('/')

    myIo.on('connection', (socket) => {

        console.log("on connection--emitting verify user");

        socket.emit("verifyUser", "");

        //code to verify the user and make him online

        socket.on("setUser", (authToken) => {

            console.log("setUser called");

            tokenLib.verifyClaimWithoutSecret(authToken, (err, user) => {
                if (err) {
                    socket.emit('auth-error', { status: 500, error: "Please provide correct auth Token" })
                }
                else {
                    console.log("user is verified..setting userDetails")
                    let currentUser = user.data;
                    //setting socket user id
                    socket.userId = currentUser.userId;
                    let fullName = `${currentUser.firstName}${currentUser.lastName}`;
                    console.log(`${fullName} is online`);

                    let userObj = { userId: currentUser.userId, fullName: fullName }
                    allOnlineUsers.push(userObj)
                    console.log(allOnlineUsers)
                    // setting room name 
                    socket.room = 'edchat'
                    // joining chat room
                    socket.join(socket.room)
                    socket.to(socket.room).broadcast.emit('online-user-list', allOnlineUsers);

                }
            })
        })
        //end of listening set-user event 
        socket.on('disconnect', () => {
            // disconnect the user from socket
            // remove the user from online list
            // unsubscribe the user from his own channel
            console.log("user is disconnected");
            console.log(socket.userId);

            var removeIndex = allOnlineUsers.map(function (user) { return user.userId; }).indexOf(socket.userId);
            console.log(allOnlineUsers);

            socket.to(socket.room).broadcast.emit('online-user-list', allOnlineUsers);
            socket.leave(socket.room)
        })
        // end of socket disconnect 

        socket.on('chat-msg', (data) => {
            console.log("socket chat-msg called")
            console.log(data);
            data['chatId'] = shortid.generate()
            console.log(data)

            //event to save chat
            setTimeout(function () {
                eventEmitter.emit('save-chat', data)

            }, 2000)
            myIo.emit(data.receiverId, data);
        });
        socket.on('typing', (fullName) => {
            socket.to(socket.room).broadcast.emit('typing', fullName);
        });

    });
}
//end of setServer function

// database operations are kept outside of socket.io code.

// saving chats to database.
eventEmitter.on('save-chat', (data) => {
    //let today = Date.now()
    let newChat = new ChatModel({
        chatId: data.chatId,
        senderName: data.senderName,
        senderId: data.senderId,
        receiverName: data.receiverName || '',
        receiverId: data.receiverId || '',
        message: data.message,
        chatRoom: data.chatRoom || '',
        createdOn: data.createdOn
    });
    newChat.save((err, result) => {
        if (err) {
            console.log(`error occured ${err}`);
        }
        else if (check.isEmpty(result)) {
            console.log("Chat is not Saved");
        }
        else {
            console.log("chat saved");
            console.log(result);
        }
    });
});
// end of saving chat
