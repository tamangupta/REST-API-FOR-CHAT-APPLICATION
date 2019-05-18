// connecting with sockets.
const socket = io('http://localhost:3000');

const authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RpZCI6Inc5U2VzUDZXcCIsImlhdCI6MTU1MDM5OTY2NjA0NiwiZXhwIjoxNTUwNDg2MDY2LCJzdWIiOiJhdXRoVG9rZW4iLCJpc3MiOiJlZENoYXQiLCJkYXRhIjp7InVzZXJJZCI6IkJ0WTV2Zk9fUCIsImZpcnN0TmFtZSI6IlRhbWFuIiwibGFzdE5hbWUiOiJHdXB0YSIsImVtYWlsIjoidGFtYW5ndXB0YTk4QGdtYWlsLmNvbSIsIm1vYmlsZU51bWJlciI6NzQ2MjI2MjU4NH19.8Engw-QGsu7SF4eHdLZ284E7DWjZ3K6zTM55HjGMsn8"
const userId = "BtY5vfO_P"

let chatMessage = {
  createdOn: Date.now(),
  receiverId: 'SJ-iectqM',//putting user2's id here 
  receiverName: "Aditya Kumar",
  senderId: userId,
  senderName: "Mr Xyz"
}

let chatSocket = () => {

  socket.on('verifyUser', (data) => {

    console.log("socket trying to verify user");

    socket.emit("setUser", authToken);

  });

  socket.on(userId, (data) => {

    console.log("you received a message from "+data.senderName)
    console.log(data.message)

  });

  socket.on("online-user-list", (data) => {

    console.log("Online user list is updated. some user can online or went offline")
    console.log(data)

  });

  socket.on("typing", (data) => {

    console.log(data+" is typing")
    
    
  });

  $("#send").on('click', function () {

    let messageText = $("#messageToSend").val()
    chatMessage.message = messageText;
    socket.emit("chat-msg",chatMessage)
    console.log(chatMessage.message)

  })

  $("#messageToSend").on('keypress', function () {

    socket.emit("typing","Rashika")

  })




}// end chat socket function

chatSocket();
