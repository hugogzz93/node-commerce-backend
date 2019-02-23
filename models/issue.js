import { Model } from 'objection'

export default class Issue extends Model {
  static tableName = 'issues'
  static jsonSchema = {
    type: 'object'
  }

  static relationMappings = {
    creator: {
      relation: Model.BelongsToOneRelation,
      modelClass: `${__dirname}/user`,
      join: {
        from: 'issues.creator_id',
        to: 'users.id'
      }
    },
    attendee: {
      relation: Model.BelongsToOneRelation,
      modelClass: `${__dirname}/user`,
      join: {
        from: 'issues.attendee_id',
        to: 'users.id'
      }
    },
    messages: {
      relation: Model.HasManyRelation,
      modelClass: `${__dirname}/issueMessage`,
      join: {
        from: 'issues.id',
        to: 'issue_messages.issue_id'
      }
    },
    order: {
      relation: Model.BelongsToOneRelation,
      modelClass: `${__dirname}/order`,
      join: {
        from: 'issues.order_id',
        to: 'orders.id'
      }
    },
    last_seen_messages: {
      relation: Model.HasManyRelation,
      modelClass: `${__dirname}/lastSeenMessage`,
      join: {
        from: 'issues.id',
        to: 'last_seen_messages.issue_id'
      }
    }
  }

  getLastMessage() {
    return this.$relatedQuery('messages').orderBy('createdAt', 'desc').first()
  }
}
