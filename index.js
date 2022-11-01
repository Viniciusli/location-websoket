const express = require('express')
const path = require('path')

const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)

let devices = []
const _token = 'verysercuretoken'

io.on('connection', socket => {
    console.log(socket.id);

    socket.on('sendLocation', data => {
        let index = devices.findIndex((item, i) => {
            return item.id = data.id
        })

        if (index === -1) {
            devices.push({
                "id": socket.id,
                "locations": [{
                    "lat": data.lat,
                    "lng": data.lng
                }] 
            })
        } else {
            devices[index].locations.push({
                "lat": data.lat,
                "lng": data.lng
            })
        }

        socket.use(([event, token], next) => {
            if (!token === _token) {
                return next(new Error('unauthorized event'))
            }
            socket.broadcast.emit('locations', devices)
            next()
        })

        socket.on('error', err => {
            if (err && err.message === 'unauthorized event') {
                socket.disconnect()
            }
        })
    })
})

server.listen(3000)