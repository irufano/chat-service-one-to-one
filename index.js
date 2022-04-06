const app = require("express")();
const server = require("http").createServer(app);
const socketIO = require("socket.io")(server);

app.get("/", (req, res) => {
  res.send(
    '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Chat Service</title><meta name="description" content="Chat service one to one using socket.io by irufano"></head><body><h3>Chat service is running...</h3></body></html>'
  );
});

socketIO.on("connection", (client) => {
  //Get the chatID of the user and join in a room of the same chatID
  chatID = client.handshake.query.chatID;
  client.join(chatID);

  //Leave the room if the user closes the socket
  client.on("disconnect", () => {
    client.leave(chatID);
  });

  //Send message to only a particular user
  client.on("send_message", (dataMessage) => {
    receiverChatID = dataMessage.receiverChatID;
    senderChatID = dataMessage.senderChatID;
    message = dataMessage.message;
    sentAt = dataMessage.sentAt;

    //Send message to only that particular room
    client.in(senderChatID).emit("receive_message", {
      message: message,
      senderChatID: senderChatID,
      receiverChatID: receiverChatID,
      sentAt: sentAt,
    });
    //Send message to only that particular room
    client.in(receiverChatID).emit("receive_message", {
      message: message,
      senderChatID: senderChatID,
      receiverChatID: receiverChatID,
      sentAt: sentAt,
    });
  });
});

var port = process.env.PORT;

server.listen(port, function (err) {
  if (err) console.log(err);
  console.log("Listening on port", port);
});
