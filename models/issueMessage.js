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
    }
  }
}
