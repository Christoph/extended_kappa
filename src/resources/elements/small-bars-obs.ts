import * as d3 from "d3";
import { inject, noView, bindable, BindingEngine } from 'aurelia-framework';
import * as _ from "lodash"

@inject(Element, BindingEngine)
@noView()
export class SmallBarsObsCustomElement {
  // D3 variables
  private svg;
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

    if (d3.select(this.element).selectAll("svg").size() > 0) {
      this.svg = d3.select(this.element).selectAll("svg").remove()
    }

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

    let chart = this.svg.selectAll("rect")
      .data(bins)

    chart.enter().append("rect")
      .merge(chart)
      .attr("class", "bar")
      .attr("x", d => this.x(d[0]))
      .attr("y", d => this.y(d[1]))
      .attr("width", this.x.bandwidth())
      .attr("height", function (d) { return self.height - self.y(d[1]); });

    chart.exit()
      .remove()

    let texts = this.svg.selectAll("texts")
      .data(bins)

    texts.enter().append("text")
      .merge(texts)
      .attr("class", "bar-text")
      .attr("x", d => this.x(d[0]))
      .attr("y", d => this.y(d[1]) - 1)
      .text(d => d[1])

    texts.exit()
      .remove()


    this.svg.selectAll(".xAxis")
      .call(d3.axisBottom(self.x).ticks(this.bins));
  }
}
