import {
  autoinject
} from 'aurelia-dependency-injection';
import {
  DataStore
} from 'data-store';

@autoinject()
export class compare {
  data;
  sort_property = "Keyword"
  search_keywords_term = ""

  constructor(public store: DataStore) {
    this.data = store.getToolData();
  }

  setSortProperty(prop) {
    this.sort_property = ""
    this.sort_property = prop
  }

  filterKeywordsFunc(searchExpression, value) {
    let itemValue = value["Keyword"];
    if (!searchExpression || !itemValue) return false;

    return itemValue.toUpperCase().indexOf(searchExpression.toUpperCase()) !== -1;
  }
}