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
  selectedCooc = []

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
      propertyName: "count",
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
      let labels = Array.from(new Set([keyword["KeyVis"], keyword["Mike"], keyword["Michael"], keyword["Torsten"]]))
      let overlap = keyword["Overlap"]

      for (const label of labels) {
        if (label_stats.has(label)) {
          label_stats.set(label, {
            overlap: label_stats.get(label).overlap + overlap,
            count: label_stats.get(label).count + 1,
            cooc: label_stats.get(label).cooc
          })
          label_stats.get(label).cooc.push(...labels.filter(word => word !== label))
        }
        else {
          label_stats.set(label, {
            overlap: overlap,
            count: 1,
            cooc: labels.filter(word => word !== label)
          })
        }
      }
    }

    label_stats.forEach((value, label) => {
      const cooc = new Map(Object.entries(_.countBy(value.cooc)));
      let cooc_list = []

      cooc.forEach((value, label) => {
        cooc_list.push({
          label: label,
          count: value
        })
      })

      this.labels.push({
        label: label,
        count: value.count,
        uncertainty: value.overlap / value.count,
        cooc: cooc_list
      })
    })
  }

  selectLabel(label) {
    this.searchLabelsTerm = label["label"]
    this.selectedCooc = label["cooc"]
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