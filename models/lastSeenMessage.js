import { Model } from 'objection'

export default class LastSeenMessage extends Model {
  static tableName = 'last_seen_messages'

  static relationMappings = {
    user:{
      relation: Model.BelongsToOneRelation,
      modelClass: `${__dirname}/user`,
      join: {
        from: 'last_seen_messages.user_id',
        to: 'users.id'
      }
    },
    issue: {
      relation: Model.BelongsToOneRelation,
      modelClass: `${__dirname}/issue`,
      join: {
        from: 'last_seen_messages.issue_id',
        to: 'issues.id'
      }
    },
    last_seen_message: {
      relation: Model.BelongsToOneRelation,
      modelClass: `${__dirname}/issueMessage`,
      join: {
        from: 'last_seen_messages.issue_message_id',
        to: 'issue_messages.id'
      }
    }
  }

  $beforeInsert() {
    this.updatedAt = new Date()
    this.createdAt = new Date()
  }

  $beforeUpdate() {
    this.updatedAt = new Date()
  }

}
