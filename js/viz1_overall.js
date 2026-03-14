// viz1_overall.js
// two charts that work together:
//   Chart A: dumbbell chart comparing how teens view social media's effect on others vs. themselves
//   Chart B: stacked bar chart showing impact on different life areas
// clicking a dot in chart A highlights the relevant segments in chart B (view coordination!)

function drawOverallViz(overall, personal, impacts) {

  // convert strings to numbers
  overall.forEach(d => d.percent = +d.percent)
  personal.forEach(d => d.percent = +d.percent)
  impacts.forEach(d => {
    d["helped a lot"]    = +d["helped a lot"]
    d["helped a little"] = +d["helped a little"]
    d["neither"]         = +d["neither"]
    d["hurt a little"]   = +d["hurt a little"]
    d["hurt a lot"]      = +d["hurt a lot"]
  })

  // merge the overall and personal datasets into one array so we can draw
  // both dots per row easily
  const categories = overall.map(d => d.overall_effect)
  const paired = categories.map(cat => {
    const o = overall.find(d => d.overall_effect === cat)
    const p = personal.find(d => d.personal_effect === cat)
    return { category: cat, general: o ? o.percent : 0, personal: p ? p.percent : 0 }
  })

  // ---- CHART A: dumbbell chart ----

  // set dimensions and margins
  const mA = { top: 40, right: 40, bottom: 46, left: 160 }
  const wA = 560 - mA.left - mA.right
  const hA = 60 * categories.length

  const totalWA = wA + mA.left + mA.right
  const totalHA = hA + mA.top  + mA.bottom

  // append svg with viewBox so it scales to fit the sticky panel
  const svgA = d3.select("#overall_chart")
    .append("svg")
    .attr("viewBox", `0 0 ${totalWA} ${totalHA}`)
    .attr("preserveAspectRatio", "xMidYMid meet")
    .style("display", "block")
    .style("width", "100%")
    .style("height", "100%")
    .style("overflow", "visible")

  const gA = svgA.append("g")
    .attr("transform", `translate(${mA.left},${mA.top})`)

  // x scale goes 0-80% (max possible response value)
  const xA = d3.scaleLinear().domain([0, 80]).range([0, wA])
  const yA = d3.scaleBand().domain(categories).range([0, hA]).padding(0.5)

  // light dashed gridlines
  gA.selectAll(".grid-line")
    .data(xA.ticks(5))
    .join("line")
    .attr("x1", d => xA(d)).attr("x2", d => xA(d))
    .attr("y1", 0).attr("y2", hA)
    .attr("stroke", "#e8e4df").attr("stroke-width", 1).attr("stroke-dasharray", "3,3")

  // put the x axis on top so it doesn't crowd the dots
  gA.append("g")
    .call(d3.axisTop(xA).ticks(5).tickFormat(d => d + "%"))
    .select(".domain").remove()

  // y axis (category labels)
  gA.append("g")
    .call(d3.axisLeft(yA).tickSize(0))
    .select(".domain").remove()

  // horizontal lines connecting the two dots for each category
  gA.selectAll(".connector")
    .data(paired)
    .join("line")
    .attr("class", "connector")
    .attr("x1", d => xA(Math.min(d.general, d.personal)))
    .attr("x2", d => xA(Math.max(d.general, d.personal)))
    .attr("y1", d => yA(d.category) + yA.bandwidth() / 2)
    .attr("y2", d => yA(d.category) + yA.bandwidth() / 2)
    .attr("stroke", "#d4cfc9").attr("stroke-width", 3).attr("stroke-linecap", "round")

  const tooltipA = d3.select("body").append("div").attr("class", "tooltip")

  // track which category is currently highlighted (null = none)
  let activeCategory = null

  function setActive(cat) {
    activeCategory = cat
    const isReset = cat === null

    // fade out the rows that aren't selected
    gA.selectAll(".dot-general, .dot-personal")
      .transition().duration(250)
      .attr("opacity", function() {
        if (isReset) return 1
        const datum = d3.select(this).datum()
        return datum.category === cat ? 1 : 0.2
      })

    gA.selectAll(".connector, .value-label-g")
      .transition().duration(250)
      .attr("opacity", function() {
        if (isReset) return 1
        const datum = d3.select(this).datum()
        return datum.category === cat ? 1 : 0.2
      })

    // trigger the highlight in chart B
    updateHighlight(cat)
    d3.select("#life_chart").style("display", "block")
    d3.select("#sticky-1-label").text("Perception  ·  Life Area Impacts")
  }

  // red dots = what teens think about social media's effect on teens in general
  gA.selectAll(".dot-general")
    .data(paired)
    .join("circle")
    .attr("class", "dot-general")
    .attr("cx", d => xA(d.general))
    .attr("cy", d => yA(d.category) + yA.bandwidth() / 2)
    .attr("r", 16)
    .attr("fill", "#c0392b")
    .style("cursor", "pointer")
    .on("mouseover", (event, d) => {
      tooltipA.style("opacity", 1)
        .html(`<strong>${d.category}</strong><br>Effect on teens in general: <strong>${d.general}%</strong>`)
    })
    .on("mousemove", event => {
      tooltipA.style("left", (event.clientX + 12) + "px").style("top", (event.clientY - 10) + "px")
    })
    .on("mouseout", () => tooltipA.style("opacity", 0))
    .on("click", (event, d) => setActive(activeCategory === d.category ? null : d.category))

  // blue dots = what teens think about social media's effect on themselves personally
  gA.selectAll(".dot-personal")
    .data(paired)
    .join("circle")
    .attr("class", "dot-personal")
    .attr("cx", d => xA(d.personal))
    .attr("cy", d => yA(d.category) + yA.bandwidth() / 2)
    .attr("r", 16)
    .attr("fill", "#2c5f8a")
    .style("cursor", "pointer")
    .on("mouseover", (event, d) => {
      tooltipA.style("opacity", 1)
        .html(`<strong>${d.category}</strong><br>Effect on me personally: <strong>${d.personal}%</strong>`)
    })
    .on("mousemove", event => {
      tooltipA.style("left", (event.clientX + 12) + "px").style("top", (event.clientY - 10) + "px")
    })
    .on("mouseout", () => tooltipA.style("opacity", 0))
    .on("click", (event, d) => setActive(activeCategory === d.category ? null : d.category))

  // percent labels inside each dot
  paired.forEach(d => {
    const cy = yA(d.category) + yA.bandwidth() / 2

    gA.append("text")
      .datum(d)
      .attr("class", "value-label-g")
      .attr("x", xA(d.general)).attr("y", cy)
      .attr("text-anchor", "middle").attr("dominant-baseline", "middle")
      .style("font-size", "10px").style("fill", "white").style("font-weight", "700")
      .style("pointer-events", "none")
      .text(d.general + "%")

    gA.append("text")
      .datum(d)
      .attr("class", "value-label-g")
      .attr("x", xA(d.personal)).attr("y", cy)
      .attr("text-anchor", "middle").attr("dominant-baseline", "middle")
      .style("font-size", "10px").style("fill", "white").style("font-weight", "700")
      .style("pointer-events", "none")
      .text(d.personal + "%")
  })

  // legend
  const legendData = [
    { label: "Teens in general", color: "#c0392b" },
    { label: "Me personally",    color: "#2c5f8a" }
  ]
  const legendG = svgA.append("g")
    .attr("transform", `translate(${mA.left}, ${mA.top + hA + 14})`)

  legendG.selectAll("circle")
    .data(legendData)
    .join("circle")
    .attr("cx", (d,i) => i * 160).attr("cy", 6).attr("r", 7).attr("fill", d => d.color)

  legendG.selectAll("text")
    .data(legendData)
    .join("text")
    .attr("x", (d,i) => i * 160 + 16).attr("y", 10)
    .style("font-size", "11px").style("fill", "#4a4440").text(d => d.label)

  // hint text so users know they can click
  svgA.append("text")
    .attr("x", mA.left + wA).attr("y", 18)
    .attr("text-anchor", "end")
    .style("font-size", "10px").style("fill", "#8a8280").style("font-style", "italic")
    .text("Click a dot to filter life impacts below ↓")

  // ---- CHART B: stacked bar chart ----

  // set dimensions and margins
  const mB = { top: 16, right: 40, bottom: 54, left: 140 }
  const wB = 560 - mB.left - mB.right
  const rowH = 36
  const hB = rowH * impacts.length

  const totalWB = wB + mB.left + mB.right
  const totalHB = hB + mB.top  + mB.bottom

  // append svg with viewBox so it scales responsively
  const svgB = d3.select("#life_chart")
    .append("svg")
    .attr("viewBox", `0 0 ${totalWB} ${totalHB}`)
    .attr("preserveAspectRatio", "xMidYMid meet")
    .style("display", "block")
    .style("width", "100%")
    .style("height", "100%")
    .style("overflow", "visible")

  const gB = svgB.append("g")
    .attr("transform", `translate(${mB.left},${mB.top})`)

  // stack keys in order from most positive to most negative
  const stackKeys = ["helped a lot", "helped a little", "neither", "hurt a little", "hurt a lot"]

  const xB = d3.scaleLinear().domain([0, 100]).range([0, wB])
  const yB = d3.scaleBand().domain(impacts.map(d => d.outcome)).range([0, hB]).padding(0.2)

  gB.append("g")
    .call(d3.axisLeft(yB).tickSize(0))
    .select(".domain").remove()

  gB.append("g")
    .attr("transform", `translate(0,${hB})`)
    .call(d3.axisBottom(xB).ticks(5).tickFormat(d => d + "%"))
    .select(".domain").remove()

  // green to red color scale for sentiment
  const colorB = d3.scaleOrdinal()
    .domain(stackKeys)
    .range(["#2a7a4f", "#a3d4b5", "#d4cfc9", "#e8a090", "#c0392b"])

  // stack the data
  const stackedB = d3.stack().keys(stackKeys)(impacts)
  const tooltipB = d3.select("body").append("div").attr("class", "tooltip")

  const layersB = gB.selectAll("g.layer")
    .data(stackedB).join("g")
    .attr("class", "layer")
    .attr("fill", d => colorB(d.key))

  layersB.selectAll("rect")
    .data(d => d).join("rect")
    .attr("y",      d => yB(d.data.outcome))
    .attr("x",      d => xB(d[0]))
    .attr("width",  d => Math.max(0, xB(d[1]) - xB(d[0])))
    .attr("height", yB.bandwidth())
    .attr("rx", 2)
    .on("mouseover", (event, d) => {
      tooltipB.style("opacity", 1).html(`
        <strong>${d.data.outcome}</strong><br>
        Helped a lot: ${d.data["helped a lot"]}%<br>
        Helped a little: ${d.data["helped a little"]}%<br>
        Neither: ${d.data["neither"]}%<br>
        Hurt a little: ${d.data["hurt a little"]}%<br>
        Hurt a lot: ${d.data["hurt a lot"]}%
      `)
    })
    .on("mousemove", event => {
      tooltipB.style("left", (event.clientX + 12) + "px").style("top", (event.clientY - 10) + "px")
    })
    .on("mouseout", () => tooltipB.style("opacity", 0))

  // legend in two rows of 3 (well, 2+3 for 5 items)
  const legendBKeys   = ["helped a lot", "helped a little", "neither", "hurt a little", "hurt a lot"]
  const legendBLabels = ["Helped a lot", "Helped a little", "Neither", "Hurt a little", "Hurt a lot"]

  const legendBG = gB.append("g").attr("transform", `translate(0, ${hB + 28})`)

  legendBKeys.forEach((key, i) => {
    const col = (i % 3) * 100
    const row = Math.floor(i / 3) * 18

    legendBG.append("rect")
      .attr("x", col).attr("y", row).attr("width", 10).attr("height", 10).attr("fill", colorB(key))

    legendBG.append("text")
      .attr("x", col + 13).attr("y", row + 9)
      .style("font-size", "9px").style("fill", "#4a4440").text(legendBLabels[i])
  })

  // ---- view coordination: clicking chart A highlights chart B ----
  function updateHighlight(category) {
    // reset if nothing selected
    if (category === null) {
      layersB.transition().duration(300).style("opacity", 1)
      return
    }
    // figure out which stack segments to highlight based on the selected category
    let highlight
    if      (category === "Mostly positive") highlight = ["helped a lot", "helped a little"]
    else if (category === "Mostly negative") highlight = ["hurt a little", "hurt a lot"]
    else                                      highlight = ["neither"]

    layersB.transition().duration(300)
      .style("opacity", d => highlight.includes(d.key) ? 1 : 0.1)
  }

  // expose reset function so scrolly.js can call it
  window._resetOverallHighlight = () => layersB.style("opacity", 1)
}