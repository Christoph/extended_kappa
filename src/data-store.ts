export class DataStore {
  public tool_data = [];

  constructor() {
    let tool_data = require('../data/tool_results.json')

    for (let row in tool_data) {
      this.tool_data.push(tool_data[row])
    }
  }

  getToolData() {
    return this.tool_data
  }
}
