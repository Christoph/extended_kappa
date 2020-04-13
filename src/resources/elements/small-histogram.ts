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
  @bindable bins: string;
  @bindable xsize: string;
  @bindable ysize: string;

  // set the dimensions and margins of the graph
  margin = { top: 0, right: 10, bottom: 20, left: 10 };
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
    this.x = d3.scaleBand()
      .range([0, this.width])
      .padding(0.1)

    this.y = d3.scaleLinear()
      .range([this.height, 0])
  }

  updateChart() {
    let self = this;

    // group the data for the bars
    const count = _.countBy(this.data, this.property)
    let bins = Object.entries(count)

    // Set x domain
    this.x.domain(Object.keys(count))

    // @ts-ignore
    this.y.domain([0, d3.max(Object.values(count))]);


    this.svg.selectAll("rect")
      .data(bins)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", d => this.x(d[0]))
      .attr("y", d => this.y(d[1]))
      .attr("width", this.x.bandwidth())
      .attr("height", function (d) { return self.height - self.y(d[1]); });

    this.svg.append("g")
      .attr("transform", "translate(0, " + this.height + ")")
      .call(d3.axisBottom(self.x).ticks(this.bins));
  }
}
