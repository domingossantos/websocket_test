console.log("worker started");
const queue = require("./queue");
queue.consume("messages", message => {
    //process the message
    console.log("processing " + message.content.toString());
})
