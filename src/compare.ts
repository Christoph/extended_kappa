import {
  autoinject
} from 'aurelia-dependency-injection';
import {
  DataStore
} from 'data-store';

@autoinject()
export class compare {
  data;
  sort_property = {
    propertyName: "Keyword",
    direction: "ascending"
  }
  search_keywords_term = ""

  constructor(public store: DataStore) {
    this.data = store.getToolData();
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
}