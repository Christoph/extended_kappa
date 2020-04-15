export class DataStore {
  public tool_data = [];
  public manual_data = [];
  public label_data = new Map();

  constructor() {
    let tool_data = require('../data/tool_results.json')
    let manual_data = require('../data/manual_results.json')
    let label_data = require('../data/labels.json')

    for (let row in tool_data) {
      this.tool_data.push(tool_data[row])
    }

    for (let row in manual_data) {
      this.manual_data.push(manual_data[row])
    }

    for (let row in label_data) {
      this.label_data.set(label_data[row]["Topic"], label_data[row]["Category"])
    }
  }

  getToolData() {
    return this.tool_data
  }

  getManualData() {
    return this.manual_data
  }

  getLabelData() {
    return this.label_data
  }
}
