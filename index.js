/**
 * Created by ejdy on 19.10.16.
 */
'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()

app.set('port', (process.env.PORT || 5000))

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

// Index route
app.get('/', function(req, res) {
    persistentMenu();
    res.send('Hello world, I am a chat bot')
});

// for Facebook verification
app.get('/webhook/', function(req, res) {
    if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
        res.send(req.query['hub.challenge'])
    }
    res.send('Error, wrong token')
})

app.post('/webhook/', function(req, res) {
    let messaging_events = req.body.entry[0].messaging;
    for (let i = 0; i < messaging_events.length; i++) {
        let event = req.body.entry[0].messaging[i]
        let sender = event.sender.id
        if (event.postback) {

            console.log(JSON.stringify(event, null, 2));
            let payload = event.postback.payload;
            if (payload === "HERMAN") {
                videoBrady(sender)
            } else if (payload === "JAK_JSEM_HRDY") {
                videoJsemHrdy(sender);
            } else {
                quickReply(sender);
            }
        } else if (event.message && event.message.quick_reply && event.message.quick_reply.payload) {
            console.log(JSON.stringify(event, null, 2));
            let payload = event.message.quick_reply.payload;
            if (payload === "HERMAN") {
                videoBrady(sender)
            } else if (payload === "JAK_JSEM_HRDY") {
                videoJsemHrdy(sender);
            } else {
                quickReply(sender);
            }

        } else if (event.message && event.message.text) {
            let text = event.message.text
            if (text === 'Generic') {
                sendGenericMessage(sender)
                continue
            }
            quickReply(sender);
        }

    }
    res.sendStatus(200)
})

const token = "EAARnBYwTpAYBALZAvupQEh7A6bPRDwyVV2Fbd9OZAgFFVKYhwrK7ERf7D3V24A0j1KdXnsH2bhEOqBbSwOp7QmB3DVPXJqkJ9m6pWwwBEyVWs0VlLRdoBcCUoSZBfHaxVegsvwY9Fv4RIuikjf9x1SjFUvGisDvyHJMat8OjAZDZD";

function sendTextMessage(sender, text) {
    let messageData = {text: text}
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: token},
        method: 'POST',
        json: {
            recipient: {id: sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}

function sendGenericMessage(sender) {
    let messageData = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "First card",
                    "subtitle": "Element #1 of an hscroll",
                    "item_url": "http://messengerdemo.parseapp.com/",
                    "image_url": "http://messengerdemo.parseapp.com/img/rift.png",
                    "buttons": [{
                        "type": "web_url",
                        "url": "https://www.messenger.com",
                        "title": "web url"
                    }, {
                        "type": "postback",
                        "title": "Postback",
                        "payload": "Payload for first element in a generic bubble",
                    }],
                }, {
                    "title": "Second card",
                    "subtitle": "Element #2 of an hscroll",
                    "item_url": "http://messengerdemo.parseapp.com/",
                    "image_url": "http://messengerdemo.parseapp.com/img/gearvr.png",
                    "buttons": [{
                        "type": "postback",
                        "title": "Postback",
                        "payload": "Payload for second element in a generic bubble",
                    }],
                }]
            }
        }
    };
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: token},
        method: 'POST',
        json: {
            recipient: {id: sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}

function videoBrady(sender) {
    let messageData = {
        "attachment": {
            "type": "video",
            "payload": {
                "url": "https://www.facebook.com/bernyz/videos/10210962774648056/"
            }
        }
    };
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: token},
        method: 'POST',
        json: {
            recipient: {id: sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
};

function videoJsemHrdy(sender) {
    let messageData = {
        text: "Na Milose jsem opravdu hrdy, jen se podivej: https://www.youtube.com/watch?v=EcSUOOVpM6Y"
    };
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: token},
        method: 'POST',
        json: {
            recipient: {id: sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
};

function quickReply(sender) {
    let messageData = {
        "text": "Tato otazka jasne ukazuje, ze i u Vas doslo k fasizaci a jednoznacne jste se stal clenem prazske kavarny. " +
        "Proto se nebudu vyjadřovat. Ale můžu se vajádřit k následujícím tématům:",
        "quick_replies": [
            {
                "content_type": "text",
                "title": "Jsem hrdý na Miloše",
                "payload": "JAK_JSEM_HRDY"
            },
            {
                "content_type": "text",
                "title": "Herman a jeho skazky",
                "payload": "HERMAN"
            }
        ]
    };
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: token},
        method: 'POST',
        json: {
            recipient: {id: sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
};


function persistentMenu() {
    let body = {
        "setting_type": "call_to_actions",
        "thread_state": "existing_thread",
        "call_to_actions": [
            {
                "type": "postback",
                "title": "Jsem hrdý na Miloše",
                "payload": "JAK_SEM_HRDY"
            },
            {
                "type": "postback",
                "title": "Herman mi nalozil",
                "payload": "HERMAN"
            },
            {
                "type": "web_url",
                "title": "Je Milos na hrade?",
                "url": "http://www.jetencurakjesteprezidentem.cz/"
            }
        ]
    };

    request({
        url: 'https://graph.facebook.com/v2.6/me/thread_settings',
        qs: {access_token: token},
        method: 'POST',
        json: body,
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
};


// Spin up the server
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
})