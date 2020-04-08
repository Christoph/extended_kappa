export class DataStore {
  public tool_data = [];
  public manual_data = [];

  constructor() {
    let tool_data = require('../data/tool_results.json')
    let manual_data = require('../data/manual_results.json')

    for (let row in tool_data) {
      this.tool_data.push(tool_data[row])
    }

    for (let row in manual_data) {
      this.manual_data.push(manual_data[row])
    }
  }

  getToolData() {
    return this.tool_data
  }

  getManualData() {
    return this.manual_data
  }
}
