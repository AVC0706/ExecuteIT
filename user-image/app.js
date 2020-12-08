const autoSave = require('./autosave')

const express = require('express');
const expressWs = require('express-ws');
const cors = require('cors');
const pty = require('node-pty');
const fs = require('fs');
const bodyParser = require('body-parser')

const app = express();

app.use(cors())
app.use(bodyParser.json());

expressWs(app);

let terminals = {},
    logs = {};
app.post('/terminals', (req, res) => {
    const env = Object.assign({}, process.env);
    env['COLORTERM'] = 'truecolor';
    env['HOME'] = `/home/${env['USER']}`
    const uid = parseInt(process.env.UID) || 2; // UID of User
    const gid = parseInt(process.env.GID) || 2; // GID of User

    const cols = parseInt(req.query.cols),
        rows = parseInt(req.query.rows),
        term = pty.spawn('bash', [], {
            name: 'xterm-256color',
            cols: cols || 80,
            rows: rows || 24,
            cwd: env['HOME'],
            env: env,
            encoding: null,
            uid,
            gid: gid
        });

    console.log('Created terminal with PID: ' + term.pid);
    terminals[term.pid] = term;
    logs[term.pid] = ""
    term.on('data', function(data) {
        logs[term.pid] += data;
    });
    res.send(term.pid.toString());
    res.end();
});

app.post('/terminals/:pid/size', (req, res) => {
    const pid = parseInt(req.params.pid),
        cols = parseInt(req.query.cols),
        rows = parseInt(req.query.rows),
        term = terminals[pid];

    term.resize(cols, rows);
    console.log('Resized terminal ' + pid + ' to ' + cols + ' cols and ' + rows + ' rows.');
    res.end();
});

app.post('/file', (req, res) => {

    const data = req.body.data;

    const dataBuf = new Buffer.from(data, 'base64');
    const dataDecoded = dataBuf.toString() + "\n\r";

    // Use /home/user as cwd
    if (req.body.fileName[0] !== '/' && req.body.fileName[0] !== '~')
        req.body.fileName = "/home/user/" + req.body.fileName;
    // Absolute path
    const path = require('path').resolve(req.body.fileName)

    if (!path.startsWith("/home/user/")) {
        // Writing to directories other than /home/user not allowed
        res.statusCode = 400;
        res.json({ status: "Writing to directories other than /home/user not allowed" });
        res.end();
    } else {
        // Write file
        fs.writeFile(path, dataDecoded, (err => {
            if (err) {
                res.statusCode = 400;
                res.json({ status: "Invalid file path or operation not permitted" });
                res.end();
            } else {
                res.json({ status: "success" });
                res.end();
            }
        }))
    }
})

app.ws('/terminals/:pid', function(ws, req) {
    let term = terminals[parseInt(req.params.pid)];
    console.log('Connected to terminal ' + term.pid);
    if (ws.readyState === 1)
        ws.send(logs[term.pid]);

    // binary message buffering
    function bufferUtf8(socket, timeout) {
        let buffer = [];
        let sender = null;
        let length = 0;
        return (data) => {
            buffer.push(data);
            length += data.length;
            if (!sender) {
                sender = setTimeout(() => {
                    if (socket.readyState === 1)
                        socket.send(Buffer.concat(buffer, length));
                    buffer = [];
                    sender = null;
                    length = 0;
                }, timeout);
            }
        };
    }
    const send = bufferUtf8(ws, 5);


    term.on('exit', () => {
        // send(new Buffer.from("Disconnected from console"))
        ws.close();
    })

    term.on('data', function(data) {
        try {
            send(data);
        } catch (ex) {
            // The WebSocket is not open, ignore
        }
    });
    ws.on('message', function(msg) {
        if(msg==='e.x.e.p.i.n.g') {
            ws.send("")
        }else
            term.write(msg);
    });
    ws.on('close', function() {
        term.kill();
        console.log('Closed terminal ' + term.pid);
        // Clean things up
        delete terminals[term.pid];
        delete logs[term.pid];
    });
});

const port = process.env.PORT || 8888
app.listen(port, '0.0.0.0', () => {
    console.log(`Listening at 0.0.0.0:${port}`)
})

// const intervalToSave = 5000;

// setInterval(() => {
//     autoSave(process.env.PROJECT_ID)
// }, intervalToSave)
