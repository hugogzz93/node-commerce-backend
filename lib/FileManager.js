import { minioClient } from '../minio'

const FileManager = {
  uploadFileForUser({id, filename, file}) { 
    return this.uploadFile({filename, file, bucket: `user-${id}`})
  },

  async uploadFile({bucket, filename, file}) {
    await this.findOrCreateBucket(bucket)
    return minioClient.putObject(bucket, filename, file)
                      .catch(err => console.error('Could not update file', err))
  },

  async findOrCreateBucket(bucket) {
    const exists = await minioClient.bucketExists(bucket)
    if(exists) return
    minioClient.makeBucket(bucket).then(() => console.log('bucket created: ', bucket))
                                  .catch(err => console.error('Could not create bucket:', err))
  },

  getFileForUser({id, fileName}) {
    return this.getFile({bucket: `user-${id}`, fileName})
  },

  getFile({bucket, fileName}) {
    return minioClient.getObject(bucket, fileName)
  }
}

export default FileManager
