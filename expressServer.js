import express from 'express'
import FileManager from './lib/FileManager'

const app = express()
app.get("/download", async (request, response) => {
  const stream = await FileManager.getFileForUser({
    id: request.query.id,
    fileName: request.query.filename
  }).catch(err => {
    if(error)
      return response.status(500).send(error)
  })

  stream.pipe(response)
});
 
app.listen(3002, () => console.log('express listening on 3002 '))
