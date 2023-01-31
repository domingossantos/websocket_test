const WebSocket = require('ws');
const queue = require("./queue");

function onError(ws, err) {
    console.error(`onError: ${err.message}`);
}

function onMessage(ws, data) {
    console.log(`onMessage: ${data}`);
    ws.send(`recebido!`);
}

function onConnection(ws, req) {
    ws.on('message', data => onMessage(ws, data));
    ws.on('error', error => onError(ws, error));
    console.log(`onConnection`);
}
function broadcast(jsonObject) {
    if (!this.clients) return;
    this.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(jsonObject));
        }
    });
}

function messages_queue() {
    if (!this.clients) return;
    queue.consume("proccess_data", message => {
        //process the message
        this.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                console.log(JSON.stringify(client.id));
                client.send(message.content.toString());
                console.log("processing " + message.content.toString());
            }
        });


    });


}

function corsValidation(origin) {
    return process.env.CORS_ORIGIN === '*' || process.env.CORS_ORIGIN.startsWith(origin);
}

function verifyClient(info, callback) {
    if (!corsValidation(info.origin)) return callback(false);

    const token = info.req.url.split('token=')[1];

    if (token) {
        if (token === '123456')
            return callback(true);

        if (token === '123')
            return callback(true);
    }

    return callback(false);
}
module.exports = (server) => {
    const wss = new WebSocket.Server({
        server,
        verifyClient
    });

    wss.on('connection', onConnection);
    wss.broadcast = broadcast;
    wss.messages_queue = messages_queue;

    console.log(`App Web Socket Server is running!`);
    return wss;
}
