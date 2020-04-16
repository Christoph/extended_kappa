import { autoinject } from 'aurelia-dependency-injection';
import { DataStore } from 'data-store';
import * as _ from "lodash";
import { observable } from 'aurelia-framework';

@autoinject()
export class Codertable {
  label_mapping;
  mike = [];
  michael = [];
  torsten = [];
  keyvis = [];

  sort_keyvis;
  sort_mike;
  sort_michael;
  sort_torsten;

  constructor(public store: DataStore) {
    this.label_mapping = store.getLabelData()
    let toolData = store.getToolData()
    let manualData = store.getManualData()

    let data = [...toolData, ...manualData]

    let mi = new Map(Object.entries(_.countBy(data, "Mike")))
    mi.forEach((value, label) => {
      this.mike.push({
        label: label,
        count: value,
        element: []
      })
    })

    mi = new Map(Object.entries(_.countBy(data, "Michael")))
    mi.forEach((value, label) => {
      this.michael.push({
        label: label,
        count: value,
        element: []
      })
    })

    mi = new Map(Object.entries(_.countBy(data, "Torsten")))
    mi.forEach((value, label) => {
      this.torsten.push({
        label: label,
        count: value,
        element: []
      })
    })

    mi = new Map(Object.entries(_.countBy(data, "KeyVis")))
    mi.forEach((value, label) => {
      this.keyvis.push({
        label: label,
        count: value,
        element: []
      })
    })

    this.sort_keyvis = {
      propertyName: "count",
      direction: "descending"
    }
    this.sort_mike = {
      propertyName: "count",
      direction: "descending"
    }
    this.sort_michael = {
      propertyName: "count",
      direction: "descending"
    }
    this.sort_torsten = {
      propertyName: "count",
      direction: "descending"
    }
  }

  setSort(prop) {
    let direction = this.sort_keyvis.direction
    if (direction == "ascending") {
      direction = "descending";
    }
    else {
      direction = "ascending";
    }

    this.sort_keyvis = {
      propertyName: prop,
      direction: direction
    }
  }
}