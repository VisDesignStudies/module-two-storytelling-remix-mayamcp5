// viz0_intro.js
function drawIntro(data) {

    const width = 600
    const height = 400
    const radius = Math.min(width, height) / 2 - 20

    const svg = d3.select("#intro_chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height)

    const g = svg.append("g")
        .attr("transform", `translate(${width/2}, ${height/2})`)

    // color mapping tied to response
    const color = d3.scaleOrdinal()
        .domain(["Too much","Too little","About right"])
        .range(["#ff6b6b","#4dabf7","#51cf66"])

    const pie = d3.pie()
        .value(d => d.percent)

    const arc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius)

    const arcs = g.selectAll("arc")
        .data(pie(data))
        .join("g")

    // slices
    arcs.append("path")
        .attr("d", arc)
        .attr("fill", d => color(d.data.response))
        .attr("stroke","white")
        .style("stroke-width","2px")

    // slice labels
    arcs.append("text")
        .attr("transform", d => `translate(${arc.centroid(d)})`)
        .attr("text-anchor","middle")
        .style("font-size","12px")
        .style("fill","white")
        .selectAll("tspan")
        .data(d => [d.data.response, d.data.percent + "%"])
        .join("tspan")
        .attr("x",0)
        .attr("dy",(d,i)=> i ? "1.2em" : 0)
        .text(d => d)
}