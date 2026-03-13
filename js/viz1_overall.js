// viz1_overall.js
function drawOverallViz(overall, personal, impacts) {

    // convert numbers
    overall.forEach(d => d.percent = +d.percent)
    personal.forEach(d => d.percent = +d.percent)

    impacts.forEach(d => {
        d["helped a lot"] = +d["helped a lot"]
        d["helped a little"] = +d["helped a little"]
        d["neither"] = +d["neither"]
        d["hurt a little"] = +d["hurt a little"]
        d["hurt a lot"] = +d["hurt a lot"]
    })

    /* ---------------------------
       CHART A — PERCEPTION BARS
    --------------------------- */

    const marginA = {top:40,right:40,bottom:50,left:60}
    const widthA = 450 - marginA.left - marginA.right
    const heightA = 300 - marginA.top - marginA.bottom

    const svgA = d3.select("#overall_chart")
    .append("svg")
    .attr("width", widthA + marginA.left + marginA.right)
    .attr("height", heightA + marginA.top + marginA.bottom)
    .append("g")
    .attr("transform",`translate(${marginA.left},${marginA.top})`)

    const categories = overall.map(d => d.overall_effect)

    const xA = d3.scaleBand()
    .domain(categories)
    .range([0,widthA])
    .padding(.3)

    const yA = d3.scaleLinear()
    .domain([0,100])
    .range([heightA,0])

    svgA.append("g")
    .attr("transform",`translate(0,${heightA})`)
    .call(d3.axisBottom(xA))

    svgA.append("g")
    .call(d3.axisLeft(yA))

    // overall bars
    svgA.selectAll(".overall")
    .data(overall)
    .join("rect")
    .attr("class","overall")
    .attr("x", d => xA(d.overall_effect))
    .attr("y", d => yA(d.percent))
    .attr("width", xA.bandwidth()/2)
    .attr("height", d => heightA - yA(d.percent))
    .attr("fill","#ff6b6b")
    .on("click",(e,d)=>updateHighlight(d.overall_effect))

    // personal bars
    svgA.selectAll(".personal")
    .data(personal)
    .join("rect")
    .attr("class","personal")
    .attr("x", d => xA(d.personal_effect) + xA.bandwidth()/2)
    .attr("y", d => yA(d.percent))
    .attr("width", xA.bandwidth()/2)
    .attr("height", d => heightA - yA(d.percent))
    .attr("fill","#4dabf7")

    /* ---------------------------
       CHART B — LIFE IMPACTS
    --------------------------- */

    const marginB = {top:40,right:40,bottom:50,left:120}
    const widthB = 600 - marginB.left - marginB.right
    const heightB = 350 - marginB.top - marginB.bottom

    const svgB = d3.select("#life_chart")
    .append("svg")
    .attr("width", widthB + marginB.left + marginB.right)
    .attr("height", heightB + marginB.top + marginB.bottom)
    .append("g")
    .attr("transform",`translate(${marginB.left},${marginB.top})`)

    const stackKeys = [
        "helped a lot",
        "helped a little",
        "neither",
        "hurt a little",
        "hurt a lot"
    ]

    const xB = d3.scaleLinear()
    .domain([0,100])
    .range([0,widthB])

    const yB = d3.scaleBand()
    .domain(impacts.map(d => d.outcome))
    .range([0,heightB])
    .padding(.2)

    svgB.append("g").call(d3.axisLeft(yB))

    svgB.append("g")
    .attr("transform",`translate(0,${heightB})`)
    .call(d3.axisBottom(xB))

    const stack = d3.stack().keys(stackKeys)

    const stacked = stack(impacts)

    const color = d3.scaleOrdinal()
    .domain(stackKeys)
    .range([
        "#2ecc71",
        "#7bed9f",
        "#dfe4ea",
        "#ffa502",
        "#ff6b6b"
    ])

    svgB.selectAll("g.layer")
    .data(stacked)
    .join("g")
    .attr("class","layer")
    .attr("fill",d=>color(d.key))
    .selectAll("rect")
    .data(d=>d)
    .join("rect")
    .attr("y",d=>yB(d.data.outcome))
    .attr("x",d=>xB(d[0]))
    .attr("width",d=>xB(d[1]) - xB(d[0]))
    .attr("height",yB.bandwidth())

    /* ---------------------------
       INTERACTION
    --------------------------- */

    function updateHighlight(category){

        let highlight

        if(category === "Mostly positive"){
            highlight = ["helped a lot","helped a little"]
        }

        else if(category === "Mostly negative"){
            highlight = ["hurt a little","hurt a lot"]
        }

        else{
            highlight = ["neither"]
        }

        svgB.selectAll(".layer")
        .style("opacity",d=>{
            if(highlight.includes(d.key)) return 1
            return 0.2
        })

    }

}