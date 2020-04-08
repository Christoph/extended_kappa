export class DataStore {
  public tool_data;

  constructor() {
    this.tool_data = require('../data/tool_results.json')

    console.log(this.tool_data)
  }
}
