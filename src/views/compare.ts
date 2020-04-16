import { autoinject } from 'aurelia-dependency-injection';
import { BindingSignaler } from 'aurelia-templating-resources';
import { DataStore } from 'data-store';
import * as _ from "lodash";
import { max } from 'd3';
import { observable } from 'aurelia-framework';

@autoinject()
export class compare {
  initialized = false;
  data;
  label_mapping;
  selectedDataset;
  properties = [];
  labels = [];
  @observable overlap_property = "Overlap"

  scrollTop = 0;

  sort_keywords;
  sort_labels;
  sort_cooc;

  searchKeywordsTerm = ""
  searchLabelsTerm = ""
  selectedCooc = []

  constructor(public store: DataStore, public signaler: BindingSignaler) {
    this.label_mapping = store.getLabelData()
    this.data = store.getToolData()
    this.selectedDataset = "Tool"

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

    this.sort_cooc = {
      propertyName: "count",
      direction: "descending"
    }

    this.initialized = true;
  }

  goto() {
    this.scrollTop = this.data[10]["element"].offsetTop
  }

  overlap_propertyChanged() {
    if (this.initialized) {
      console.log("changed")
      this.setOverlapSortProperty()
      this.setOverlapSortProperty()
      this.computeLabelStats()
    }
  }

  computeDerivedValues() {
    // Coder Overlap
    for (const row of this.data) {
      // let overlap = new Set([row["KeyVis"], row["Mike"], row["Michael"], row["Torsten"]]).size
      let n = 3
      let overlap = 0
      let overlap_cat = 0

      let elements = new Set([row["Mike"], row["Michael"], row["Torsten"]]).size
      let elements_cat = new Set([this.label_mapping.get(row["Mike"]), this.label_mapping.get(row["Michael"]), this.label_mapping.get(row["Torsten"])]).size

      if (elements == 1) overlap = 1
      else if (elements > 1 && elements < n) overlap = elements / n
      else if (elements == n) overlap = 0

      row["Overlap"] = overlap

      if (elements_cat == 1) overlap_cat = 1
      else if (elements_cat > 1 && elements_cat < n) overlap_cat = elements_cat / n
      else if (elements_cat == n) overlap_cat = 0

      row["Overlap_Category"] = overlap_cat

      row["element"] = []
    }
  }

  computeLabelStats() {
    let label_stats = new Map()
    this.labels.length = 0;

    for (const keyword of this.data) {
      // let labels = Array.from(new Set([keyword["KeyVis"], keyword["Mike"], keyword["Michael"], keyword["Torsten"]]))
      let overlap;
      let labels = Array.from(new Set([keyword["Mike"], keyword["Michael"], keyword["Torsten"]]))

      if (this.overlap_property) {
        overlap = keyword["Overlap"]
      }
      else {
        overlap = keyword["Overlap_Category"]
      }

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
        uncertainty: 1 - (value.overlap / value.count),
        cooc: cooc_list
      })
    })

    // for (const label of this.labels) {
    //   label.uncertainty = label.uncertainty / max(this.labels, d => d.uncertainty)
    // }
  }

  selectLabel(label) {
    this.searchLabelsTerm = label["label"]
    this.selectedCooc = label["cooc"]
  }

  setDataset(dataset) {
    if (dataset == "tool") {
      this.data = this.store.getToolData()
      this.selectedDataset = "Tool"
    }
    else {
      this.data = this.store.getManualData()
      this.selectedDataset = "Manual"
    }

    this.computeDerivedValues()
    this.computeLabelStats()
  }

  getAgreementColor(keyword) {
    let overlap;
    if (this.overlap_property) {
      overlap = keyword["Overlap"]
    }
    else {
      overlap = keyword["Overlap_Category"]
    }

    if (overlap == 1) return "rgba(0, 128, 0, 0.606)";
    else if (overlap == 0) return "rgba(255, 99, 71, 0.401)";
    else return "rgba(0, 128, 0, 0.406)"
    // else if (overlap == 4) return "rgba(0, 128, 0, 0.206)"
  }

  getHighlight(label) {
    if (this.searchLabelsTerm) {
      if (this.searchLabelsTerm.toUpperCase().indexOf(label.toUpperCase())) {
        return 0.25;
      }
      else {
        return 1;
      }
    }
    return 1
  }

  setOverlapSortProperty() {
    let overlap;
    if (this.overlap_property) {
      overlap = "Overlap"
    }
    else {
      overlap = "Overlap_Category"
    }

    let direction = this.sort_keywords.direction
    if (direction == "ascending") {
      direction = "descending";
    }
    else {
      direction = "ascending";
    }

    this.sort_keywords = {
      propertyName: overlap,
      direction: direction
    }
  }

  setKeywordSortProperty(prop) {
    let direction = this.sort_keywords.direction
    if (direction == "ascending") {
      direction = "descending";
    }
    else {
      direction = "ascending";
    }

    this.sort_keywords = {
      propertyName: prop,
      direction: direction
    }
  }

  setLabelSortProperty(prop) {
    let direction = this.sort_labels.direction
    if (direction == "ascending") {
      direction = "descending";
    }
    else {
      direction = "ascending";
    }

    this.sort_labels = {
      propertyName: prop,
      direction: direction
    }
  }

  setCoocSortProperty(prop) {
    let direction = this.sort_cooc.direction
    if (direction == "ascending") {
      direction = "descending";
    }
    else {
      direction = "ascending";
    }

    this.sort_cooc = {
      propertyName: prop,
      direction: direction
    }
  }

  resetSearch() {
    this.searchLabelsTerm = "";
  }

  filterKeywordsFunc(searchExpression, value) {
    let itemValue = value["Keyword"];
    if (!searchExpression || !itemValue) return false;

    return itemValue.toUpperCase().indexOf(searchExpression.toUpperCase()) !== -1;
  }

  filterLabelsFunc(searchExpression, value) {
    // let itemValue = [value["KeyVis"], value["Mike"], value["Michael"], value["Torsten"]].join(" ");
    let itemValue = [value["Mike"], value["Michael"], value["Torsten"]].join(" ");
    if (!searchExpression || !itemValue) return false;

    return itemValue.toUpperCase().indexOf(searchExpression.toUpperCase()) !== -1;
  }

  filterLabelsListFunc(searchExpression, value) {
    let itemValue = value["label"]
    if (!searchExpression || !itemValue) return false;

    return itemValue.toUpperCase().indexOf(searchExpression.toUpperCase()) !== -1;
  }
}