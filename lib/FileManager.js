import { minioClient } from '../minio'

const FileManager = {
  async uploadFile({bucket, fileName, file}) {
    await this.findOrCreateBucket(bucket)
    return minioClient.putObject(bucket, fileName, file)
                      .catch(err => console.log('Could not update file', err))
  },

  async findOrCreateBucket(bucket) {
    const exists = await minioClient.bucketExists(bucket)
    if(exists) return
    minioClient.makeBucket(bucket).then(() => console.log('bucket created: ', bucket))
                                  .catch(err => console.log('Could not create bucket:', err))
  }
}

export default FileManager
