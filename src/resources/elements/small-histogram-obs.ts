import * as d3 from "d3";
import { inject, noView, bindable, BindingEngine } from 'aurelia-framework';
import * as _ from "lodash"

@inject(Element, BindingEngine)
@noView()
export class SmallHistogramObsCustomElement {
  // D3 variables
  private svg;
  private histogram;
  private y: d3.ScaleLinear<number, number>;
  private x;

  private isInitialized = false;

  @bindable data;
  private subscription;
  @bindable property: string;
  @bindable bins: string;
  @bindable xsize: string;
  @bindable ysize: string;

  // set the dimensions and margins of the graph
  margin = { top: 10, right: 10, bottom: 20, left: 10 };
  height: number;
  width: number;

  constructor(public element: Element, private bindingEngine) {
  }

  attached() {
    if (this.data) {
      // subscribe to the data array and watch for changes
      this.subscription = this.bindingEngine
        .collectionObserver(this.data)
        .subscribe(splices => this.dataChanged(splices));
    }

    this.width = parseInt(this.xsize) - this.margin.left - this.margin.right;
    this.height = parseInt(this.ysize) - this.margin.top - this.margin.bottom;

    this.initChart();
    this.isInitialized = true;
    this.updateChart();
  }

  unbind() {
    this.subscription.dispose();
  }

  dataChanged(data) {
    if (this.isInitialized) {
      this.svg.selectAll("rect").remove()
      this.svg.selectAll("text").remove()
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

    this.svg.append("g")
      .attr("class", "xAxis")
      .attr("transform", "translate(0, " + this.height + ")")

    // set the ranges
    this.x = d3.scaleLinear()
      .range([0, this.width])

    this.y = d3.scaleLinear()
      .range([this.height, 0])

  }

  updateChart() {
    let self = this;

    // Set x domain
    this.x.domain(d3.extent(this.data, d => d[this.property]))

    // Histogram
    this.histogram = d3.histogram()
      .value(function (d) { return d[self.property]; })
      .domain(this.x.domain())
    // .thresholds(this.x.ticks(this.bins))

    let bins = this.histogram(this.data);

    // @ts-ignore
    this.y.domain([0, d3.max(bins, function (d) { return d.length; })]);

    // Join the rect with the bins data
    var chart = this.svg.selectAll("rect")
      .data(bins)

    chart.enter()
      .append("rect")
      .merge(chart)
      .attr("x", d => this.x(d.x0))
      .attr("y", d => this.y(d.length))
      .attr("width", function (d) { return self.x(d.x1) - self.x(d.x0) - 1; })
      .attr("height", function (d) { return self.height - self.y(d.length); })

    chart.enter()
      .append("text")
      .merge(chart)
      .attr("class", "bar-text")
      .attr("x", d => this.x(d.x0))
      .attr("y", d => this.y(d.length))
      .text(d => d.length)

    chart.exit()
      .remove()

    this.svg.selectAll(".xAxis")
      .call(d3.axisBottom(self.x).ticks(this.bins));
  }
}
