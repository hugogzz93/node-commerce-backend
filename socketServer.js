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
  socket.on('message', input => {
    dataSources.issueApi
    .createMessage(input)
    .then(msg => {console.log(`msg_ack: ${msg.body}`); socket.emit('msg_ack', {author: {id: msg.author_id}, ...msg})})
    .catch(err => {console.error('msg_fail', input, err); socket.emit('msg_fail')})
  })
})

http.listen(3003, () => console.log('chatServer listening on 3003'))



