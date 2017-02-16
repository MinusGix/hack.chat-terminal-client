/* jshint esversion:6 */
process.stdin.resume();
process.stdin.setEncoding('utf8');
var WebSocket = require('ws'),
    fs = require('fs'),
    chalk = require("chalk"),
    util = require('util'),
    ws = {},
    config = JSON.parse(fs.readFileSync(__dirname + '/config.json', 'utf8')),
    send = (args) => ws.send(JSON.stringify(args)),
    onlineUsers = [],
    maxLength = 35,
    COMMANDS = {
        chat: (args) => {
            var trip = args.trip;
            if (['undefined', undefined, null, false, true, Infinity].indexOf(trip) >= 0) {
                trip = config.settings.displayNonTripsAs;
            }
            var text = `<${trip} - `;
            if (config.settings.displayUsernamesEqualSized) {
                text += ' '.repeat(24 - args.nick.length) + args.nick;
            } else {
                text += args.nick;
            }
            text += `> ${args.text}`;
            if (config.settings.haveColors) {
                if (args.mod) {
                    if (config.settings.modsColor !== 'default') {
                        text = chalk[config.settings.modsColor](text);
                    }
                    if (config.settings.modsBackgroundColor !== 'default') {
                        text = chalk[`bg${config.settings.modsBackgroundColor[0].toUpperCase()+config.settings.modsBackgroundColor.slice(1, config.settings.modsBackgroundColor.length)}`](text);
                    }
                } else if (args.admin && config.settings.adminsColor !== 'default') {
                    if (config.settings.adminsColor !== 'default') {
                        text = chalk[config.settings.adminsColor](text);
                    }
                    if (config.settings.adminsBackgroundColor !== 'default') {
                        text = chalk[`bg${config.settings.adminsBackgroundColor[0].toUpperCase()+config.settings.adminsBackgroundColor.slice(1, config.settings.adminsBackgroundColor.length)}`](text);
                    }
                } else if (args.nick === config.username) {
                    if (config.settings.youColor !== 'default') {
                        text = chalk[config.settings.youColor](text);
                    }
                    if (config.settings.youBackgroundColor !== 'default') {
                        text = chalk[`bg${config.settings.youBackgroundColor[0].toUpperCase()+config.settings.youBackgroundColor.slice(1, config.settings.youBackgroundColor.length)}`](text);
                    }

                } else {
                    if (config.settings.normalColor !== 'default') {
                        text = chalk[config.settings.normalColor](text);
                    }
                    if (config.settings.normalBackgroundColor !== 'default') {
                        text = chalk[`bg${config.settings.normalBackgroundColor[0].toUpperCase()+config.settings.normalBackgroundColor.slice(1, config.settings.normalBackgroundColor.length)}`](text);
                    }
                }
            }
            console.log(text);
        },
        warn: (args) => {
            var text = `<${'|WARNING|'.repeat((maxLength-2)/9)}> ${args.text}`
            if (config.settings.haveColors) {
                if (config.settings.warningBackgroundColor !== 'default') {
                    text = chalk[`bg${config.settings.warningBackgroundColor[0].toUpperCase()+config.settings.warningBackgroundColor.slice(1, config.settings.warningBackgroundColor.length)}`](text);
                }
                if (config.settings.warningColor !== 'default') {
                    text = chalk[config.settings.warningColor](text);
                }
            }
            console.log(text);
        },
        info: (args) => {
            var text = `<${'|SERVER|'.repeat((maxLength-2)/8)}> ${args.text}`;
            if (config.settings.haveColors) {
                if (config.settings.serverBackgroundColor !== 'default') {
                    text = chalk[`bg${config.settings.serverBackgroundColor[0].toUpperCase()+config.settings.serverBackgroundColor.slice(1, config.settings.serverBackgroundColor.length)}`](text);
                }
                if (config.settings.serverColor !== 'default') {
                    text = chalk[config.settings.serverColor](text);
                }
            }
            console.log(text);
        },
        onlineSet: (args) => {
            onlineUsers = args.nicks;
            COMMANDS.info({
                text: `Online users: ${onlineUsers.join(', ')}.`
            });
        },
        onlineAdd: (args) => {
            onlineUsers.push(args.nick);
            COMMANDS.info({
                text: `${args.nick} joined the channel.`
            });
        },
        onlineRemove: (args) => {
            var index = onlineUsers.indexOf(args.nick);
            if (index >= 0) {
                onlineUsers.splice(index, 1);
            }
            COMMANDS.info({
                text: `${args.nick} left channel.`
            });
        }
    };

function join() {
    ws = new WebSocket(config.address);
    var connected = false;
    ws.on('open', () => {
        if (config.settings.separateUserAndPass) {
            send({
                cmd: 'join',
                nick: config.username,
                password: config.password,
                channel: config.channel
            });
        } else {
            send({
                cmd: 'join',
                nick: `${config.username}#${config.password}`,
                channel: config.channel
            });
        }
        connected = true;
    });
    ws.on('close', () => {
        if (connected) {
            COMMANDS.warn({
                text: "Disconnected. Attempting to reconnect..."
            });
        }
        window.setTimeout(() => join());
    });
    ws.on('message', (data, flags) => {
        var args = JSON.parse(data);
        COMMANDS[args.cmd](args);
    });
}
join();
process.stdin.on('data', function(text) {
    var t = util.inspect(text).replace("'", '').split('').reverse().join('');

    console.log(t);
    console.log(typeof(t))
    send({
        cmd: 'chat',
        text: t.replace(/\'n\\r\\/, '').split('').reverse().join('')
    });
});