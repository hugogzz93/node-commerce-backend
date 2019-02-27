import { DataSource } from 'apollo-datasource'

export default class IssueAPI extends DataSource {
  constructor({ store }) {
    super();
    this.store = store;
  }

  initialize(config) {
    this.context = config.context;
  }

  query() {
    return this.store.Issue.query()
  }

  async createMessage(input) {
    const issue = await this.store.Issue.query().where({id: input.issue_id})
    if(issue.status == 'closed') throw {message: "Can't add messages to closed issues"}
    const message = await this.store.IssueMessage.query().insert(input)
    const user = await this.store.User.query().where({id: input.author_id}).first()
    await user.updateLastSeenMessage({issue_id: message.issue_id, issue_message_id: message.id})
    return message
  }
}
