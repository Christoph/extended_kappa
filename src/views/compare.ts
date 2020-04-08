import { autoinject } from 'aurelia-dependency-injection';
import { DataStore } from 'data-store';
import * as _ from "lodash";

@autoinject()
export class compare {
  data;
  properties = [];
  labels = [];
  sort_keywords;
  sort_labels;
  searchKeywordsTerm = ""
  searchLabelsTerm = ""

  constructor(public store: DataStore) {
    this.data = store.getToolData()
    this.properties = Object.getOwnPropertyNames(this.data[0])
    this.sort_keywords = {
      propertyName: this.properties[0],
      direction: "ascending"
    }

    this.computeDerivedValues()
    this.computeLabelStats()

    this.sort_labels = {
      propertyName: "uncertainty",
      direction: "descending"
    }
  }

  computeDerivedValues() {
    // Coder Overlap
    for (const row of this.data) {
      let overlap = new Set([row["KeyVis"], row["Mike"], row["Michael"], row["Torsten"]]).size

      row["Overlap"] = overlap
    }
  }

  computeLabelStats() {
    let label_stats = new Map()

    for (const keyword of this.data) {
      let labels = [keyword["KeyVis"], keyword["Mike"], keyword["Michael"], keyword["Torsten"]]
      let overlap = keyword["Overlap"]

      for (const label of labels) {
        if (label_stats.has(label)) {
          label_stats.set(label, label_stats.get(label) + overlap)
        }
        else {
          label_stats.set(label, overlap)
        }
      }
    }

    label_stats.forEach((value, label) => {
      this.labels.push({
        label: label,
        uncertainty: value
      })
    })
  }

  selectLabel(label) {
    this.searchLabelsTerm = label
  }

  getAgreementColor(overlap) {
    if (overlap == 4) return "Tomato";
    else if (overlap == 3) return "Orange";
    else if (overlap == 2) return "Green";
    else return "Steelblue";
  }

  getHighlight(label) {
    if (this.searchLabelsTerm && this.searchLabelsTerm.toUpperCase().indexOf(label.toUpperCase())) {
      return 0.25
    }
    else return 1
  }

  setSortProperty(prop, sort_object_name) {
    let direction = this[sort_object_name].direction
    if (direction == "ascending") {
      direction = "descending";
    }
    else {
      direction = "ascending";
    }

    this[sort_object_name] = {
      propertyName: prop,
      direction: direction
    }
  }

  filterKeywordsFunc(searchExpression, value) {
    let itemValue = value["Keyword"];
    if (!searchExpression || !itemValue) return false;

    return itemValue.toUpperCase().indexOf(searchExpression.toUpperCase()) !== -1;
  }

  filterLabelsFunc(searchExpression, value) {
    let itemValue = [value["KeyVis"], value["Mike"], value["Michael"], value["Torsten"]].join(" ");
    if (!searchExpression || !itemValue) return false;

    return itemValue.toUpperCase().indexOf(searchExpression.toUpperCase()) !== -1;
  }

  filterLabelsListFunc(searchExpression, value) {
    let itemValue = value["label"]
    if (!searchExpression || !itemValue) return false;

    return itemValue.toUpperCase().indexOf(searchExpression.toUpperCase()) !== -1;
  }
}