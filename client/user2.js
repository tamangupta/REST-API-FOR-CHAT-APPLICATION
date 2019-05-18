// connecting with sockets.
const socket = io('http://localhost:3000');

const authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RpZCI6Im0xN3FvcldERyIsImlhdCI6MTU1MDQwMzc2MjAwMSwiZXhwIjoxNTUwNDkwMTYyLCJzdWIiOiJhdXRoVG9rZW4iLCJpc3MiOiJlZENoYXQiLCJkYXRhIjp7InVzZXJJZCI6ImRrekFYZ2VKUiIsImZpcnN0TmFtZSI6IlJhc2hpa2EiLCJsYXN0TmFtZSI6IkFncmF3YWwiLCJlbWFpbCI6InJhc2lrYUBnbWFpbC5jb20iLCJtb2JpbGVOdW1iZXIiOjk4NTgyNTQ1Mjh9fQ.5rFNu-H03X_MlpREpsUnJyxmpB4hXHuS7MIhyjq4gbA"
const userId= "dkzAXgeJR"

let chatMessage = {
  createdOn: Date.now(),
  receiverId: 'H1pOQGY9M',//putting user2's id here 
  receiverName: "Mr Xyz",
  senderId: userId,
  senderName: "Aditya Kumar"
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

    console.log("Online user list is updated. some user came online or went offline")
    console.log(data)

  });


  $("#send").on('click', function () {

    let messageText = $("#messageToSend").val()
    chatMessage.message = messageText;
    socket.emit("chat-msg",chatMessage)
    console.log(chatMessage.message)
  })

  $("#messageToSend").on('keypress', function () {

    socket.emit("typing","Taman Gupta")

  })

  socket.on("typing", (data) => {

    console.log(data+" is typing")
    
    
  });



}// end chat socket function

chatSocket();
