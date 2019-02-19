import { Model } from 'objection'

export default class Issue extends Model {
  static tableName = 'issues'
  static jsonSchema = {
    type: 'object',
    required: ['order_item_id']
  }

  static relationMappings = {
    creator: {
      relation: Model.BelongsToRelation,
      modelClass: `${__dirname}/user`,
      join: {
        from: 'issues.creator_id',
        to: 'users.id'
      }
    },
    attendee: {
      relation: Model.BelongsToRelation,
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
    }
  }
}
