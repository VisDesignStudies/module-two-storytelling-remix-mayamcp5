// viz3_positive.js - same structure as viz2 but for positive experiences
// sorted from most to least common total positive experience

function drawPositiveViz(data) {

  // convert strings to numbers and compute total positive (a lot + a little)
  data.forEach(d => {
    d["a lot"]    = +d["a lot"]
    d["a little"] = +d["a little"]
    d["no"]       = +d["no"]
    d.total_positive = d["a lot"] + d["a little"]
  })

  // sort so most common positive experiences appear at the top
  data.sort((a, b) => b.total_positive - a.total_positive)

  // set dimensions and margins
  const rowH   = 46
  const margin = { top: 20, right: 40, bottom: 54, left: 210 }
  const width  = 580 - margin.left - margin.right
  const height = rowH * data.length  // dynamic height based on number of rows

  const totalH = height + margin.top + margin.bottom
  const totalW = width  + margin.left + margin.right

  // append svg using viewBox so it scales to fill the sticky panel
  const svg = d3.select("#positive_chart")
    .append("svg")
    .attr("viewBox", `0 0 ${totalW} ${totalH}`)
    .attr("preserveAspectRatio", "xMidYMid meet")
    .style("display", "block")
    .style("width", "100%")
    .style("height", "100%")
    .style("overflow", "visible")
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`)

  // stack the three response levels
  const stack   = d3.stack().keys(["a lot","a little","no"])
  const stacked = stack(data)

  // x goes 0-100%
  const x = d3.scaleLinear().domain([0, 100]).range([0, width])
  const y = d3.scaleBand()
    .domain(data.map(d => d.experience))
    .range([0, height])
    .padding(0.25)

  // dark green to light green to gray
  const color = d3.scaleOrdinal()
    .domain(["a lot","a little","no"])
    .range(["#2a7a4f","#a3d4b5","#d4cfc9"])

  svg.append("g")
    .call(d3.axisLeft(y).tickSize(0))
    .select(".domain").remove()

  svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x).ticks(5).tickFormat(d => d + "%"))
    .select(".domain").remove()

  // tooltip
  const tooltip = d3.select("body").append("div").attr("class", "tooltip")

  // draw stacked bars
  const layerGroups = svg.selectAll(".layer")
    .data(stacked).join("g")
    .attr("class", d => `layer layer-pos-${d.key.replace(/ /g,"-")}`)
    .attr("fill",  d => color(d.key))

  layerGroups.selectAll("rect")
    .data(d => d).join("rect")
    .attr("y",      d => y(d.data.experience))
    .attr("x",      d => x(d[0]))
    .attr("width",  d => Math.max(0, x(d[1]) - x(d[0])))
    .attr("height", y.bandwidth())
    .attr("rx", 2)
    .on("mouseover", (event, d) => {
      const e = d.data
      tooltip.style("opacity", 1).html(
        `<strong>${e.experience}</strong><br>A lot: ${e["a lot"]}%<br>A little: ${e["a little"]}%<br>None: ${e["no"]}%`
      )
    })
    .on("mousemove", event => {
      tooltip.style("left", (event.clientX + 12) + "px").style("top", (event.clientY - 10) + "px")
    })
    .on("mouseout", () => tooltip.style("opacity", 0))

  // legend below the chart
  const cats   = ["a lot","a little","no"]
  const labels = ["A lot","A little","None"]

  const legendG = svg.append("g").attr("transform", `translate(0, ${height + 28})`)

  legendG.selectAll("rect")
    .data(cats).join("rect")
    .attr("x", (d,i) => i * 85).attr("y", 0)
    .attr("width", 10).attr("height", 10).attr("fill", d => color(d))

  legendG.selectAll("text")
    .data(labels).join("text")
    .attr("x", (d,i) => i * 85 + 14).attr("y", 9)
    .style("font-size", "11px").style("fill", "#4a4440").text(d => d)

  // expose a highlight function so scrolly.js can call it when steps change
  window.positiveHighlight = function(mode) {
    if (mode === null) {
      svg.selectAll(".layer").style("opacity", 1)
    } else if (mode === "a lot") {
      // emphasize "a lot" segments when scrolled to that step
      svg.selectAll(".layer").transition().duration(400)
        .style("opacity", d => d.key === "a lot" ? 1 : 0.15)
    } else {
      svg.selectAll(".layer").transition().duration(400).style("opacity", 1)
    }
  }
}