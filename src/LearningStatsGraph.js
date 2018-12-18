import * as d3 from "d3";

export default class LearningStatsGraph {
  constructor(el) {
    this.svg = d3.select(el),
    this.$el = $(el)

    var margin = { top: 20, right: 20, bottom: 30, left: 50 };
    
    this.width = this.$el.width() - margin.left - margin.right;
    this.height = this.$el.height() - margin.top - margin.bottom;

    this.container = this.svg.attr("width", this.width)
      .attr("height", this.height)
      .append("g")
      .attr("transform", 
            "translate(" + margin.left + "," + margin.top + ")");
  }

  display(data, stat){
    this.container.selectAll("*").remove()
    
    var x = d3.scaleLinear().rangeRound([0,this.width]),
        y = d3.scaleLinear().rangeRound([this.height,0])


    var line = d3.line()
        .x(function(d) { return x(d.epoch)})
        .y(function(d) { return y(d[stat])})
    
    x.domain(d3.extent(data, function(d) { return d.epoch }));
    y.domain(d3.extent(data, function(d) { return d[stat] }));

    this.container.append("g")
      .attr("transform", "translate(0," + this.height + ")")
      .call(d3.axisBottom(x))
      .select(".domain")
      .remove();

    this.container.append("g")
      .call(d3.axisLeft(y))
      .append("text")
      .attr("fill", "#000")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text(stat);

    this.container.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 1.5)
      .attr("d", line);
  }
}
