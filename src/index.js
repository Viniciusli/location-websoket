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
        console.log(data);
        console.log(devices);

        if (devices.length < 20) {
            let index = devices.findIndex((item, i) => {
                console.log(item.id);
                return item.id = data.id
            })
            console.log(index);
    
            if (index === -1) {
                console.log('inside if');
                devices.push({
                    "id": data.id,
                    "location": data.location
                })
                console.log(devices);
            } else {
                console.log('inside else');
                devices[index].location = data.location
                console.log(devices);
            }
            console.log('after conditional');
    
            console.log(`Locations:`);
            console.log(devices);
            console.log('----------------------------------------------------');
        } else {
            console.log('too many devices connected');
        }

        
        // socket.use(([event, token], next) => {
        //     if (!token === _token) {
        //         return next(new Error('unauthorized event'))
        //     }
        //     socket.broadcast.emit('locations', devices)
        //     next()
        // })

        // socket.on('error', err => {
        //     if (err && err.message === 'unauthorized event') {
        //         socket.disconnect()
        //     }
        // })
    })

    socket.on('disconnect', () => {
        devices.pop()
    })
})

server.listen(5000, () => console.log(`server is running on http://localhost:5000`))