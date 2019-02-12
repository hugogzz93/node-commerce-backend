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
}
