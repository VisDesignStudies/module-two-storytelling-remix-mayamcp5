// viz4_individuals.js - scatter plot of individual students
// x = mental health score, y = daily social media usage hours
// circle size = usage hours (bigger = more time on social media)
// color = gender, click a dot to see that student's profile

function drawIndividualsViz(data) {

  if (!data || data.length === 0) return

  // convert strings to numbers
  data.forEach(d => {
    d.Avg_Daily_Usage_Hours = +d.Avg_Daily_Usage_Hours
    d.Sleep_Hours_Per_Night = +d.Sleep_Hours_Per_Night
    d.Mental_Health_Score   = +d.Mental_Health_Score
    d.Age = +d.Age
  })

  const container = document.getElementById("individuals_chart")
  const W = Math.min(container.offsetWidth || 680, 680)

  // extra top margin reserves space for the legend above the plot
  const legendH = 36
  const margin  = { top: legendH + 36, right: 24, bottom: 56, left: 70 }
  const H       = 420
  const plotW   = W - margin.left - margin.right
  const plotH   = H - margin.top  - margin.bottom

  // append the svg
  const svg = d3.select("#individuals_chart")
    .append("svg")
    .attr("width", W)
    .attr("height", H)

  const g = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`)

  // x = mental health score (1-10), y = usage hours
  const xScore = d3.scaleLinear().domain([1, 10]).range([0, plotW])
  const yUsage = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.Avg_Daily_Usage_Hours) + 1])
    .range([plotH, 0])

  // circle radius scales with usage hours (sqrt scale so area is proportional)
  const size = d3.scaleSqrt()
    .domain(d3.extent(data, d => d.Avg_Daily_Usage_Hours))
    .range([4, 12])

  // color by gender
  const colorScale = d3.scaleOrdinal()
    .domain(["Male","Female","Other"])
    .range(["#4C78A8","#e8a090","#c8952a"])

  // add x axis
  const xAxis = g.append("g")
    .attr("transform", `translate(0,${plotH})`)
    .call(d3.axisBottom(xScore).ticks(9))

  xAxis.select(".domain").style("stroke","rgba(255,255,255,0.2)")
  xAxis.selectAll(".tick line").style("stroke","rgba(255,255,255,0.15)")
  xAxis.selectAll("text").style("fill","#b8b0a8")

  // add y axis
  const yAxis = g.append("g")
    .call(d3.axisLeft(yUsage).ticks(6))

  yAxis.select(".domain").style("stroke","rgba(255,255,255,0.2)")
  yAxis.selectAll(".tick line").style("stroke","rgba(255,255,255,0.15)")
  yAxis.selectAll("text").style("fill","#b8b0a8")

  // axis labels
  g.append("text")
    .attr("x", plotW / 2).attr("y", plotH + 44)
    .attr("text-anchor","middle")
    .style("font-size","12px").style("fill","#8a8280")
    .text("Mental Health Score (1 = lowest, 10 = highest)")

  // rotate the y axis label
  g.append("text")
    .attr("transform","rotate(-90)")
    .attr("x", -plotH / 2).attr("y", -52)
    .attr("text-anchor","middle")
    .style("font-size","12px").style("fill","#8a8280")
    .text("Daily Social Media Usage (hrs)")

  // faint horizontal gridlines
  g.append("g").attr("class","grid")
    .selectAll("line")
    .data(yUsage.ticks(6))
    .join("line")
    .attr("x1",0).attr("x2",plotW)
    .attr("y1",d=>yUsage(d)).attr("y2",d=>yUsage(d))
    .attr("stroke","rgba(255,255,255,0.06)").attr("stroke-width",1)

  // legend sits above the plot area (margin.top reserves the space for it)
  const legendData = [
    { label:"Male",   color:"#4C78A8" },
    { label:"Female", color:"#e8a090" },
    { label:"Other",  color:"#c8952a" }
  ]

  const legendG = svg.append("g")
    .attr("transform", `translate(${margin.left}, 20)`)

  legendG.append("text")
    .attr("x", 0).attr("y", 10)
    .style("font-size","11px").style("fill","#8a8280")
    .text("Gender:")

  legendData.forEach((d, i) => {
    legendG.append("circle")
      .attr("cx", 58 + i * 80).attr("cy", 6)
      .attr("r", 6).attr("fill", d.color)

    legendG.append("text")
      .attr("x", 68 + i * 80).attr("y", 10)
      .style("font-size","11px").style("fill","#b8b0a8")
      .text(d.label)
  })

  legendG.append("text")
    .attr("x", 310).attr("y", 10)
    .style("font-size","11px").style("fill","#8a8280")
    .text("Circle size = usage hours")

  // tooltip
  const tooltip = d3.select("body").append("div").attr("class","tooltip")

  // small random horizontal jitter so dots at the same score don't all stack
  // (y is already spread by usage hours, so we only need slight x jitter)
  const jitterX = data.map(() => (Math.random() - 0.5) * 18)

  // draw all the dots
  const circles = g.selectAll("circle.dot")
    .data(data)
    .join("circle")
    .attr("class","dot")
    .attr("cx", (d,i) => xScore(d.Mental_Health_Score) + jitterX[i])
    .attr("cy", d => yUsage(d.Avg_Daily_Usage_Hours))
    .attr("r",  d => size(d.Avg_Daily_Usage_Hours))
    .attr("fill", d => colorScale(d.Gender))
    .attr("opacity", 0.65)
    .attr("stroke","none")
    .style("cursor","pointer")
    .on("mouseover", (event, d) => {
      d3.select(event.currentTarget)
        .attr("opacity", 1).attr("stroke","#fff").attr("stroke-width",1.5)
      tooltip.style("opacity",1).html(`
        <strong>${d.Academic_Level || "Student"}</strong><br>
        Country: ${d.Country || "—"}<br>
        Usage: ${d.Avg_Daily_Usage_Hours} hrs/day<br>
        Sleep: ${d.Sleep_Hours_Per_Night} hrs/night<br>
        Mental Health: ${d.Mental_Health_Score}/10
      `)
    })
    .on("mousemove", event => {
      tooltip.style("left",(event.clientX+14)+"px").style("top",(event.clientY-10)+"px")
    })
    .on("mouseout", event => {
      const el = d3.select(event.currentTarget)
      // only reset if this dot isn't the selected one
      if (!el.classed("selected")) el.attr("opacity",0.65).attr("stroke","none")
      tooltip.style("opacity",0)
    })
    .on("click", (event, d) => {
      // deselect everything first, then highlight the clicked dot
      circles.classed("selected",false).attr("stroke","none").attr("stroke-width",0).attr("opacity",0.45)
      d3.select(event.currentTarget)
        .classed("selected",true).attr("stroke","#fff").attr("stroke-width",2).attr("opacity",1)
      updateProfile(d)
    })

  // fills the profile panel on the right with the clicked student's data
  function updateProfile(d) {
    d3.select("#profile_panel").html(`
      <h3>Student Profile</h3>
      <p><strong>Age:</strong> ${d.Age || "—"}</p>
      <p><strong>Gender:</strong> ${d.Gender || "—"}</p>
      <p><strong>Country:</strong> ${d.Country || "—"}</p>
      <hr>
      <p><strong>Academic Level:</strong> ${d.Academic_Level || "—"}</p>
      <p><strong>Main Platform:</strong> ${d.Most_Used_Platform || "—"}</p>
      <hr>
      <p style="font-size:0.78rem;color:#8a8280;margin-bottom:8px;">vs. all students:</p>
      <div id="profile_viz"></div>
    `)
    drawProfileViz(d)
  }

  // small sparkline-style bar chart comparing this student to the full dataset
  function drawProfileViz(d) {
    const metrics = [
      { label:"Daily usage (hrs)",   field:"Avg_Daily_Usage_Hours", value:d.Avg_Daily_Usage_Hours },
      { label:"Sleep (hrs/night)",   field:"Sleep_Hours_Per_Night",  value:d.Sleep_Hours_Per_Night  },
      { label:"Mental health (1–10)", field:"Mental_Health_Score",   value:d.Mental_Health_Score    }
    ]

    const w = 240, h = 130
    const rowH = 36, startY = 24

    const pvSvg = d3.select("#profile_viz")
      .append("svg").attr("width",w).attr("height",h)

    metrics.forEach((m, i) => {
      // scale based on min/max across all students
      const min   = d3.min(data, r => r[m.field])
      const max   = d3.max(data, r => r[m.field])
      const scale = d3.scaleLinear().domain([min,max]).range([10, w-10])
      const cy    = startY + i * rowH

      // gray track (full range)
      pvSvg.append("line")
        .attr("x1",scale(min)).attr("x2",scale(max))
        .attr("y1",cy).attr("y2",cy)
        .attr("stroke","rgba(255,255,255,0.12)").attr("stroke-width",5).attr("stroke-linecap","round")

      // gold fill up to this student's value
      pvSvg.append("line")
        .attr("x1",scale(min)).attr("x2",scale(m.value))
        .attr("y1",cy).attr("y2",cy)
        .attr("stroke","#c8952a").attr("stroke-width",5).attr("stroke-linecap","round")

      // dot at the student's position
      pvSvg.append("circle")
        .attr("cx",scale(m.value)).attr("cy",cy).attr("r",6)
        .attr("fill","#c8952a").attr("stroke","#1a1614").attr("stroke-width",1.5)

      // label above the track
      pvSvg.append("text")
        .attr("x",10).attr("y",cy - 10)
        .style("font-size","10px").style("fill","#8a8280")
        .text(`${m.label}: ${m.value}`)
    })
  }
}