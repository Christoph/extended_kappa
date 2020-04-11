import * as d3 from "d3";
import { inject, noView, bindable } from 'aurelia-framework';
import * as _ from "lodash"

@inject(Element)
@noView()
export class SmallHistogramCustomElement {
  // D3 variables
  private svg;
  private histogram;
  private y: d3.ScaleLinear<number, number>;
  private x;

  private isInitialized = false;

  @bindable data;
  @bindable property: string;
  @bindable xsize: string;
  @bindable ysize: string;

  // set the dimensions and margins of the graph
  margin = { top: 0, right: 0, bottom: 0, left: 0 };
  height: number;
  width: number;

  constructor(public element: Element) {
  }

  attached() {
    this.width = parseInt(this.xsize) - this.margin.left - this.margin.right;
    this.height = parseInt(this.ysize) - this.margin.top - this.margin.bottom;

    this.initChart();
    this.isInitialized = true;
    this.updateChart();
  }

  dataChanged(data) {
    if (this.isInitialized) {
      // if (typeof percent === "string") {
      //   this.percent = parseFloat(percent)
      // }
      this.updateChart();
    }
  }

  initChart() {
    this.svg = d3.select(this.element)
      .append("svg")
      .attr("width", this.width + this.margin.left + this.margin.right)
      .attr("height", this.height + this.margin.top + this.margin.bottom)
      .append("g")
      .attr("transform",
        "translate(" + this.margin.left + "," + this.margin.top + ")");

    // set the ranges
    this.x = d3.scaleLinear()
      .range([0, this.width])
    // .domain([0, 1])

    this.y = d3.scaleLinear()
      .range([0, this.height])
    // .domain([0, 1])

    // add the x Axis
    this.svg.append("g")
      .attr("transform", "translate(0," + this.height + ")")
      .attr("class", "xAxis");
  }

  updateChart() {
    let self = this;

    // set histogram
    this.histogram = d3.histogram()
      .value(d => d[this.property])
      .domain([1, 4])
      .thresholds(4);

    // group the data for the bars
    let bins = this.histogram(this.data);
    console.log(self.height)

    this.x.domain([0, 4])
    // @ts-ignore
    this.y.domain([0, 4]);
    // this.y.domain([0, d3.max(bins, d => d.length)]);

    this.svg.selectAll("rect")
      .data(bins)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", 1)
      .attr("transform", function (d) {
        return "translate(" + self.x(d.x0) + "," + self.y(d.length) + ")";
      })
      .attr("width", function (d) { return self.x(d.x1) - self.x(d.x0) - 1; })
      .attr("height", function (d) { return self.height - self.y(d.length); });

    this.svg.append("g")
      .attr("transform", "translate(0, " + self.height + ")")
      .call(d3.axisBottom(self.x));
  }
}
