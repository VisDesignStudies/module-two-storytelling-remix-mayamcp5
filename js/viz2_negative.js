// viz2_negative.js
function drawNegativeViz(data){

    // convert numbers
    data.forEach(d=>{
        d["a lot"] = +d["a lot"]
        d["a little"] = +d["a little"]
        d["no"] = +d["no"]

        d.total_negative = d["a lot"] + d["a little"]
    })

    // sort by negative experiences
    data.sort((a,b)=> b.total_negative - a.total_negative)

    const margin = {top:40,right:40,bottom:40,left:200}
    const width = 650 - margin.left - margin.right
    const height = 300 - margin.top - margin.bottom

    const svg = d3.select("#negative_chart")
    .append("svg")
    .attr("width",width + margin.left + margin.right)
    .attr("height",height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",`translate(${margin.left},${margin.top})`)

    // stack
    const stack = d3.stack()
        .keys(["a lot","a little","no"])

    const stacked = stack(data)

    // scales
    const x = d3.scaleLinear()
        .domain([0,100])
        .range([0,width])

    const y = d3.scaleBand()
        .domain(data.map(d=>d.experience))
        .range([0,height])
        .padding(.3)

    const color = d3.scaleOrdinal()
        .domain(["a lot","a little","no"])
        .range(["#c92a2a","#ffa8a8","#dee2e6"])

    // axes
    svg.append("g")
        .call(d3.axisLeft(y))

    svg.append("g")
        .attr("transform",`translate(0,${height})`)
        .call(d3.axisBottom(x))

    // tooltip
    const tooltip = d3.select("body")
        .append("div")
        .style("position","absolute")
        .style("background","white")
        .style("padding","8px")
        .style("border","1px solid #ccc")
        .style("border-radius","4px")
        .style("opacity",0)

    // bars
    svg.selectAll(".layer")
        .data(stacked)
        .join("g")
        .attr("fill", d => color(d.key))
        .selectAll("rect")
        .data(d => d)
        .join("rect")
        .attr("y", d => y(d.data.experience))
        .attr("x", d => x(d[0]))
        .attr("height", y.bandwidth())
        .attr("width", d => x(d[1]) - x(d[0]))

        .on("mouseover",(event,d)=>{

            const exp = d.data

            tooltip
                .style("opacity",1)
                .html(`
                    <strong>${exp.experience}</strong><br>
                    A lot: ${exp["a lot"]}%<br>
                    A little: ${exp["a little"]}%<br>
                    No: ${exp["no"]}%
                `)

        })

        .on("mousemove",(event)=>{
            tooltip
                .style("left",(event.pageX+10)+"px")
                .style("top",(event.pageY+10)+"px")
        })

        .on("mouseout",()=>{
            tooltip.style("opacity",0)
        })

    // legend
    const legend = svg.append("g")
        .attr("transform",`translate(${width-120},0)`)

    const categories = ["a lot","a little","no"]

    legend.selectAll("rect")
        .data(categories)
        .join("rect")
        .attr("x",0)
        .attr("y",(d,i)=>i*20)
        .attr("width",12)
        .attr("height",12)
        .attr("fill",d=>color(d))

    legend.selectAll("text")
        .data(categories)
        .join("text")
        .attr("x",18)
        .attr("y",(d,i)=>i*20+10)
        .text(d=>d)
        .style("font-size","12px")

}