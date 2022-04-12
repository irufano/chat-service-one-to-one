const app = require("express")();
const server = require("http").createServer(app);
const socketIO = require("socket.io")(server);

app.get("/", (req, res) => {
  res.send(
    '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Chat Service</title><meta name="description" content="Chat service private messaging (one to one) using socket.io by irufano"><link rel="icon" type="image/png" href="https://irufano.com/irufanotheme/assets/images/logo-2.png"></link></head><body><h3>Chat service is running...</h3><br><br><br><img src="https://irufano.com/irufanotheme/assets/images/logo-2.png" alt="Placeholder image" style="width:128px;height:128px;"></img></body></html>'
  );
});

const availableUsers = [
  {
    userId: "1111",
    username: "Nano Nano",
    chatId: null,
  },
  {
    userId: "2222",
    username: "Pendekar Biru",
    chatId: null,
  },
  {
    userId: "3333",
    username: "Jagoan Neon",
    chatId: null,
  },
  {
    userId: "4444",
    username: "Hot Hot Pop",
    chatId: null,
  },
  {
    userId: "5555",
    username: "Harum Manis",
    chatId: null,
  },
];

const onlineUsers = [];

socketIO.on("connection", (client) => {
  var srvSockets = socketIO.sockets.sockets;
  // Object.keys(srvSockets).length.toString()
  // var nspSockets = socketIO.of('/chat').sockets;
  // Object.keys(nspSockets).length.toString()

  availableUsers.sort((a, b) => a.username.localeCompare(b.username));
  client.emit("available-users", availableUsers);

  // user connected
  client.on("user-connect", function (user) {
    client.username = user.username;

    let indexUser = availableUsers
      .map((x) => {
        return x.userId;
      })
      .indexOf(user.userId);
    availableUsers.splice(indexUser, 1);
    availableUsers.sort((a, b) => a.username.localeCompare(b.username));
    socketIO.emit("available-users", availableUsers);

    onlineUsers.push({
      userId: user.userId,
      username: client.username,
      chatId: client.id,
    });
    onlineUsers.sort((a, b) => a.username.localeCompare(b.username));
    socketIO.emit("online-users", onlineUsers);
  });

  // user disconnected
  client.on("user-disconnect", (user) => {
    // available users
    availableUsers.push({
      userId: user.userId,
      username: client.username,
      chatId: null,
    });
    availableUsers.sort((a, b) => a.username.localeCompare(b.username));
    socketIO.emit("available-users", availableUsers);

    // online users
    let indexUser = onlineUsers
      .map((x) => {
        return x.userId;
      })
      .indexOf(user.userId);
    onlineUsers.splice(indexUser, 1);
    onlineUsers.sort((a, b) => a.username.localeCompare(b.username));
    socketIO.emit("online-users", onlineUsers);
  });

  // send message
  client.on("send-message", (dataMessage) => {
    let to = dataMessage.toId;
    client.to(to).emit("send-message", {
      content,
      from: client.id,
    });
  });
});

// socketIO.on("connection", (client) => {
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
