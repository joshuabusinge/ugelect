import define1 from "./7a9e12f9fb3d8e06@459.js";

function _1(md){return(
md`# Bar Chart

A bar chart showing registered voters vs total votes.`
)}

function _metric(Inputs){return(
Inputs.radio(new Map([["Absolute", "absolute"], ["Relative", "relative"]]), {value: "absolute", label: "Change"})
)}

function _3(md){return(
md`← decrease · Registered Voters that didn't Vote (Registered Voters vs Total Votes) per District · increase →
`
)}

function _chart(DivergingBarChart,states,metric,d3,width){return(
DivergingBarChart(states, {
  x: metric === "absolute" ? d => d[2019] - d[2010] : d => d[2019] / d[2010] - 1,
  y: d => d.State,
  yDomain: d3.groupSort(states, ([d]) => d[2019] - d[2010], d => d.State),
  xFormat: metric === "absolute" ? "d" : "+%",
  xLabel: "← decrease · Registered Voters that didn't Vote(Registered Voters vs Total Votes) · increase →",
  width,
  marginRight: 70,
  marginLeft: 70,
  colors: d3.schemeRdBu[3]
})
)}

function _states(FileAttachment){return(
FileAttachment("elections1@3.csv").csv({typed: true})
)}

function _6(howto){return(
howto("DivergingBarChart")
)}

function _7(altplot,metric){return(
altplot(`Plot.plot({
  x: {
    tickFormat: "+${metric === "absolute" ? "s" : "%"}"
  },
  marks: [
    Plot.barX(states, {
      x: d => ${metric === "absolute" ? `d[2019] - d[2010]` : `d[2019] / d[2010] - 1`},
      y: "State",
      fill: d => d[2019] < d[2010],
      sort: {y: "x"}
    })
  ]
})`)
)}

function _DivergingBarChart(d3){return(
function DivergingBarChart(data, {
  x = d => d, // given d in data, returns the (quantitative) x-value
  y = (d, i) => i, // given d in data, returns the (ordinal) y-value
  title, // given d in data, returns the title text
  marginTop = 30, // top margin, in pixels
  marginRight = 40, // right margin, in pixels
  marginBottom = 10, // bottom margin, in pixels
  marginLeft = 40, // left margin, in pixels
  width = 640, // outer width of chart, in pixels
  height, // the outer height of the chart, in pixels
  xType = d3.scaleLinear, // type of x-scale
  xDomain, // [xmin, xmax]
  xRange = [marginLeft, width - marginRight], // [left, right]
  xFormat, // a format specifier string for the x-axis
  xLabel, // a label for the x-axis
  yPadding = 0.1, // amount of y-range to reserve to separate bars
  yDomain, // an array of (ordinal) y-values
  yRange, // [top, bottom]
  colors = d3.schemePiYG[3] // [negative, …, positive] colors
} = {}) {
  // Compute values.
  const X = d3.map(data, x);
  const Y = d3.map(data, y);

  // Compute default domains, and unique the y-domain.
  if (xDomain === undefined) xDomain = d3.extent(X);
  if (yDomain === undefined) yDomain = Y;
  yDomain = new d3.InternSet(yDomain);

  // Omit any data not present in the y-domain.
  // Lookup the x-value for a given y-value.
  const I = d3.range(X.length).filter(i => yDomain.has(Y[i]));
  const YX = d3.rollup(I, ([i]) => X[i], i => Y[i]);

  // Compute the default height.
  if (height === undefined) height = Math.ceil((yDomain.size + yPadding) * 25) + marginTop + marginBottom;
  if (yRange === undefined) yRange = [marginTop, height - marginBottom];

  // Construct scales, axes, and formats.
  const xScale = xType(xDomain, xRange);
  const yScale = d3.scaleBand(yDomain, yRange).padding(yPadding);
  const xAxis = d3.axisTop(xScale).ticks(width / 80, xFormat);
  const yAxis = d3.axisLeft(yScale).tickSize(0).tickPadding(6);
  const format = xScale.tickFormat(100, xFormat);

  // Compute titles.
  if (title === undefined) {
    title = i => `${Y[i]}\n${format(X[i])}`;
  } else if (title !== null) {
    const O = d3.map(data, d => d);
    const T = title;
    title = i => T(O[i], i, data);
  }

  const svg = d3.create("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

  svg.append("g")
      .attr("transform", `translate(0,${marginTop})`)
      .call(xAxis)
      .call(g => g.select(".domain").remove())
      .call(g => g.selectAll(".tick line").clone()
          .attr("y2", height - marginTop - marginBottom)
          .attr("stroke-opacity", 0.1))
      .call(g => g.append("text")
          .attr("x", xScale(0))
          .attr("y", -22)
          .attr("fill", "currentColor")
          .attr("text-anchor", "center")
          .text(xLabel));

  const bar = svg.append("g")
    .selectAll("rect")
    .data(I)
    .join("rect")
      .attr("fill", i => colors[X[i] > 0 ? colors.length - 1 : 0])
      .attr("x", i => Math.min(xScale(0), xScale(X[i])))
      .attr("y", i => yScale(Y[i]))
      .attr("width", i => Math.abs(xScale(X[i]) - xScale(0)))
      .attr("height", yScale.bandwidth());

  if (title) bar.append("title")
      .text(title);

  svg.append("g")
      .attr("text-anchor", "end")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
    .selectAll("text")
    .data(I)
    .join("text")
      .attr("text-anchor", i => X[i] < 0 ? "end" : "start")
      .attr("x", i => xScale(X[i]) + Math.sign(X[i] - 0) * 4)
      .attr("y", i => yScale(Y[i]) + yScale.bandwidth() / 2)
      .attr("dy", "0.35em")
      .text(i => format(X[i]));

  svg.append("g")
      .attr("transform", `translate(${xScale(0)},0)`)
      .call(yAxis)
      .call(g => g.selectAll(".tick text")
        .filter(y => YX.get(y) < 0)
          .attr("text-anchor", "start")
          .attr("x", 6));

  return svg.node();
}
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["elections1@3.csv", {url: new URL("./files/9870a4695728677c869543ebb3c54a59ac8949f4af4fed044fc8f2365b98fe855e2e7be23f13e70d451e308a582f3e3ab8ca7441be25cee50fc265eb802da8f8.csv", import.meta.url), mimeType: "text/csv", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("viewof metric")).define("viewof metric", ["Inputs"], _metric);
  main.variable(observer("metric")).define("metric", ["Generators", "viewof metric"], (G, _) => G.input(_));
  main.variable(observer()).define(["md"], _3);
  main.variable(observer("chart")).define("chart", ["DivergingBarChart","states","metric","d3","width"], _chart);
  main.variable(observer("states")).define("states", ["FileAttachment"], _states);
  main.variable(observer()).define(["howto"], _6);
  main.variable(observer()).define(["altplot","metric"], _7);
  main.variable(observer("DivergingBarChart")).define("DivergingBarChart", ["d3"], _DivergingBarChart);
  const child1 = runtime.module(define1);
  main.import("howto", child1);
  main.import("altplot", child1);
  return main;
}
