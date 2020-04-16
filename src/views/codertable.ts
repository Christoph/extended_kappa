import { autoinject } from 'aurelia-dependency-injection';
import { DataStore } from 'data-store';
import * as _ from "lodash";
import { observable } from 'aurelia-framework';

@autoinject()
export class Codertable {
  activeLabel = "";
  mike = [];
  michael = [];
  torsten = [];
  keyvis = [];
  datasets = []

  scrollKeyvis = 0;
  scrollMike = 0;
  scrollMichael = 0;
  scrollTorsten = 0;

  sort_keyvis;
  sort_mike;
  sort_michael;
  sort_torsten;

  constructor(public store: DataStore) {
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

    this.datasets.push({
      data: this.keyvis,
      scroller: "keyvis"
    })
    this.datasets.push({
      data: this.mike,
      scroller: "mike"
    })
    this.datasets.push({
      data: this.michael,
      scroller: "michael"
    })
    this.datasets.push({
      data: this.torsten,
      scroller: "torsten"
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

  selectLabel(label, source) {
    this.activeLabel = label

    for (const other of this.datasets) {
      let row = other.data.filter(d => d.label == label.label)
      if (row.length > 0) {
        if (other.scroller == "keyvis") this.scrollKeyvis = row[0].element.offsetTop
        if (other.scroller == "mike") this.scrollMike = row[0].element.offsetTop
        if (other.scroller == "michael") this.scrollMichael = row[0].element.offsetTop
        if (other.scroller == "torsten") this.scrollTorsten = row[0].element.offsetTop
      }
    }
  }

  getHighlight(label) {
    console.log(this.activeLabel)
    if (this.activeLabel.length > 0) {
      if (this.activeLabel != label.label) {
        return 0.25;
      }
      else {
        return 1;
      }
    }
    return 1
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