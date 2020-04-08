import {
  autoinject
} from 'aurelia-dependency-injection';
import {
  DataStore
} from 'data-store';

@autoinject()
export class compare {
  constructor(public store: DataStore) {

  }
}