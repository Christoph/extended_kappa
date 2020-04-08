import {
  autoinject
} from 'aurelia-dependency-injection';
import {
  DataStore
} from 'data-store';

@autoinject()
export class compare {
  data;
  properties = []
  sort_property;
  search_keywords_term = ""
  search_labels_term = ""

  constructor(public store: DataStore) {
    this.data = store.getToolData()
    this.properties = Object.getOwnPropertyNames(this.data[0])
    this.sort_property = {
      propertyName: this.properties[0],
      direction: "ascending"
    }

    this.computeDerivedValues()
  }

  computeDerivedValues() {
    // Coder Overlap
    for (const row of this.data) {
      let overlap = new Set([row["KeyVis"], row["Mike"], row["Michael"], row["Torsten"]]).size

      row["Overlap"] = overlap
    }
  }

  getAgreementColor(overlap) {
    console.log(overlap)
    if (overlap == 4) return "Tomato";
    else if (overlap == 3) return "Orange";
    else if (overlap == 2) return "Green";
    else return "Steelblue";
  }

  setSortProperty(prop) {
    let direction = this.sort_property.direction
    if (direction == "ascending") {
      direction = "descending";
    }
    else {
      direction = "ascending";
    }

    this.sort_property = {
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
}