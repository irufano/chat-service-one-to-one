"use strict";

var app = require("express")();

var server = require("http").createServer(app);

var socketIO = require("socket.io")(server);

app.get("/", function (req, res) {
  res.send('<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Chat Service</title><meta name="description" content="Chat service one to one using socket.io by irufano"></head><body><h3>Chat service is running...</h3></body></html>');
});
var availableUsers = [{
  userId: "1111",
  username: "NanoNano"
}, {
  userId: "2222",
  username: "PendekarBiru"
}, {
  userId: "3333",
  username: "JagoanNeon"
}, {
  userId: "4444",
  username: "HotHotPop"
}, {
  userId: "5555",
  username: "HarumManis"
}];
var onlineUsers = [];
socketIO.on("connection", function (client) {
  var srvSockets = socketIO.sockets.sockets; // Object.keys(srvSockets).length.toString()
  // var nspSockets = io.of('/chat').sockets;

  client.emit("available-users", availableUsers);
  client.on("send-user", function (user) {
    client.username = user.username;
    var indexUser = availableUsers.map(function (x) {
      return x.userId;
    }).indexOf(user.userId);
    availableUsers.splice(indexUser, 1);
    client.emit("available-users", availableUsers);
    onlineUsers.push({
      userId: user.userId,
      username: client.username
    });
  });
}); // socketIO.on("connection", (client) => {
// //Get the chatID of the user and join in a room of the same chatID
// chatID = client.handshake.query.chatID;
// client.join(chatID);
// //Leave the room if the user closes the socket
// client.on("disconnect", () => {
//   client.leave(chatID);
// });
// //Send message to only a particular user
// client.on("send_message", (dataMessage) => {
//   receiverChatID = dataMessage.receiverChatID;
//   senderChatID = dataMessage.senderChatID;
//   message = dataMessage.message;
//   sentAt = dataMessage.sentAt;
//   //Send message to only that particular room
//   client.in(receiverChatID).emit("receive_message", {
//     message: message,
//     senderChatID: senderChatID,
//     receiverChatID: receiverChatID,
//     sentAt: sentAt,
//   });
// });
// });

var port = process.env.PORT;
server.listen(port, function (err) {
  if (err) console.log(err);
  console.log("Listening on port", port);
});