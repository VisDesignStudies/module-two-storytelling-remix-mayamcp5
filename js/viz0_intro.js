// viz0_intro.js - donut chart showing how much time teens think they spend on social media

function drawIntro(data) {

  // get container width so the chart fits nicely
  const container = document.getElementById("intro_chart")
  const W = Math.min(container.offsetWidth || 620, 620)
  const H = 500
  // leave enough room on the edges for the outside labels
  const radius = Math.min(W, H) / 2 - 70

  // append the svg to the intro chart div
  const svg = d3.select("#intro_chart")
    .append("svg")
    .attr("width", W)
    .attr("height", H)
    .style("display", "block")
    .style("margin", "0 auto")

  // center everything in the middle of the svg
  const g = svg.append("g")
    .attr("transform", `translate(${W/2}, ${H/2})`)

  // color for each response category
  const color = d3.scaleOrdinal()
    .domain(["Too much", "About right", "Too little"])
    .range(["#c0392b", "#c8952a", "#2c5f8a"])

  // set up the pie layout using percent values
  const pie = d3.pie()
    .value(d => d.percent)
    .sort(null)

  // inner radius makes it a donut instead of a full pie
  const arc = d3.arc()
    .innerRadius(radius * 0.55)
    .outerRadius(radius)

  // slightly bigger arc for hover effect
  const arcHover = d3.arc()
    .innerRadius(radius * 0.55)
    .outerRadius(radius + 10)

  // tooltip div
  const tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")

  // create a group for each slice
  const arcs = g.selectAll(".arc-g")
    .data(pie(data))
    .join("g")
    .attr("class", "arc-g")

  // draw the slices
  arcs.append("path")
    .attr("d", arc)
    .attr("fill", d => color(d.data.response))
    .attr("stroke", "#f7f4f0")
    .attr("stroke-width", 3)
    .style("cursor", "pointer")
    .on("mouseover", function(event, d) {
      // expand slice on hover
      d3.select(this).transition().duration(150).attr("d", arcHover)
      tooltip
        .style("opacity", 1)
        .html(`<strong>${d.data.response}</strong><br>${d.data.percent}% of teens`)
    })
    .on("mousemove", (event) => {
      tooltip
        .style("left", (event.clientX + 14) + "px")
        .style("top",  (event.clientY - 10) + "px")
    })
    .on("mouseout", function() {
      // shrink back to normal
      d3.select(this).transition().duration(150).attr("d", arc)
      tooltip.style("opacity", 0)
    })

  // position labels outside the donut using centroid of a bigger arc
  const labelArc = d3.arc()
    .innerRadius(radius + 36)
    .outerRadius(radius + 36)

  arcs.append("text")
    .attr("transform", d => `translate(${labelArc.centroid(d)})`)
    .attr("text-anchor", "middle")
    .style("font-family", "'Source Serif 4', Georgia, serif")
    .style("font-size", "13px")
    .style("fill", "#4a4440")
    .selectAll("tspan")
    .data(d => [d.data.response, d.data.percent + "%"])
    .join("tspan")
    .attr("x", 0)
    .attr("dy", (d, i) => i ? "1.3em" : 0)
    .style("font-weight", (d, i) => i ? "700" : "400")
    .style("fill", (d, i) => i ? "#1a1614" : "#4a4440")
    .text(d => d)

  // label in the hole of the donut
  g.append("text")
    .attr("text-anchor", "middle")
    .attr("dy", "-0.2em")
    .style("font-family", "'Playfair Display', Georgia, serif")
    .style("font-size", "14px")
    .style("fill", "#8a8280")
    .text("Time on")

  g.append("text")
    .attr("text-anchor", "middle")
    .attr("dy", "1.1em")
    .style("font-family", "'Playfair Display', Georgia, serif")
    .style("font-size", "14px")
    .style("fill", "#8a8280")
    .text("Social Media")
}