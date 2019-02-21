import Socket from 'socket.io'
import { Server } from 'http'
import express from 'express'
import { dataSources } from './datastore'


const app = express()
const http = Server(app)
const io = Socket(http)

io.on('connection', socket => {
  console.log('user connected')
  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
  socket.on('join', room => socket.join(room))
  socket.on('message', ({room, ...input}) => {
    dataSources.issueApi
    .createMessage(input)
    .then(msg => {
      console.log(`room: ${room} - msg_ack: ${msg.body}`); 
      io.in(room).emit('msg_ack', {author: {id: msg.author_id}, ...msg})
      io.in('game').emit('big-announcement', 'the game will start soon');
    })
    .catch(err => {console.error('msg_fail', input, err); socket.emit('msg_fail', err, input)})
  })
})

http.listen(3003, () => console.log('chatServer listening on 3003'))



