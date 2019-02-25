import Socket from 'socket.io'
import { Server } from 'http'
import express from 'express'
import { dataSources } from './datastore'


const app = express()
const http = Server(app)
const io = Socket(http)
const connections = {}

io.on('connection', socket => {
  console.log('user connected')
  connections[socket] = {}
  socket.on('disconnect', () => {
    console.log('user disconnected')
    delete connections.socket
  })
  socket.on('join', room => {console.log('user joining:', room); socket.join(room, err => {
    if(err)
      console.log('couldnt join room:', room)
    else
      socket.emit('room_joined', room)
  } ) })
  socket.on('msg_seen', ( input ) => {
    console.log(`message seen - msg: ${input.issue_message_id}, user: ${input.user_id} `)
    if(connections[socket].msg_seen == input.issue_message_id) return
    connections[socket].msg_seen = input.issue_message_id
    dataSources.userApi.updateLastMessageSeen(input)
  })
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



