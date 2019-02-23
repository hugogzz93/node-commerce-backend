import { Model } from 'objection'

export default class IssueMessage extends Model {
  static tableName = 'issue_messages'
  static jsonSchema = {
    type: 'object',
    required: ['body', 'author_id']
  }

  static relationMappings = {
    issue: {
      relation: Model.BelongsToOneRelation,
      modelClass: `${__dirname}/issue`,
      join: {
        from: 'issue_messages.issue_id',
        to: 'issues.id'
      }
    },
    last_seen_messages: {
      relation: Model.HasManyRelation,
      modelClass: `${__dirname}/lastSeenMessage`,
      join: {
        from: 'issue_messages.id',
        to: 'last_seen_messages.issue_message_id'
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
