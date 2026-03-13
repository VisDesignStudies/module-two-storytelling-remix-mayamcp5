function drawIndividualsViz(data){

const width = 650
const height = 420
const margin = {top:40, right:20, bottom:50, left:60}

const svg = d3.select("#individuals_chart")
.append("svg")
.attr("width",width)
.attr("height",height)

const plotWidth = width - margin.left - margin.right
const plotHeight = height - margin.top - margin.bottom

const g = svg.append("g")
.attr("transform",`translate(${margin.left},${margin.top})`)


// DATA PARSING

data.forEach(d=>{
d.Avg_Daily_Usage_Hours = +d.Avg_Daily_Usage_Hours
d.Sleep_Hours_Per_Night = +d.Sleep_Hours_Per_Night
d.Mental_Health_Score = +d.Mental_Health_Score
d.Age = +d.Age
})


// SCALES

const x = d3.scaleLinear()
.domain([1,10])
.range([0,plotWidth])

const size = d3.scaleSqrt()
.domain(d3.extent(data,d=>d.Avg_Daily_Usage_Hours))
.range([3,10])

const color = d3.scaleOrdinal()
.domain(["Male","Female"])
.range(["#4C78A8","#E45756"])


// AXIS

g.append("g")
.attr("transform",`translate(0,${plotHeight})`)
.call(d3.axisBottom(x).ticks(10))

g.append("text")
.attr("x",plotWidth/2)
.attr("y",plotHeight+40)
.attr("text-anchor","middle")
.text("Mental Health Score (1–10)")


// TOOLTIP

const tooltip = d3.select("body")
.append("div")
.style("position","absolute")
.style("background","white")
.style("border","1px solid #ccc")
.style("padding","6px")
.style("border-radius","6px")
.style("font-size","12px")
.style("opacity",0)


// POINTS (JITTER)

const circles = g.selectAll("circle")
.data(data)
.join("circle")

.attr("cx",d=>x(d.Mental_Health_Score) + (Math.random()*20-10))
.attr("cy",()=>Math.random()*plotHeight)

.attr("r",d=>size(d.Avg_Daily_Usage_Hours))
.attr("fill",d=>color(d.Gender))
.attr("opacity",0.8)

.style("cursor","pointer")

.on("mouseover",(event,d)=>{

tooltip.style("opacity",1)

tooltip.html(`
<strong>${d.Academic_Level}</strong><br>
Country: ${d.Country}<br>
Usage: ${d.Avg_Daily_Usage_Hours} hrs<br>
Sleep: ${d.Sleep_Hours_Per_Night} hrs
`)
})

.on("mousemove",(event)=>{
tooltip
.style("left",(event.pageX+10)+"px")
.style("top",(event.pageY-15)+"px")
})

.on("mouseout",()=>{
tooltip.style("opacity",0)
})

.on("click",(event,d)=>{

circles.attr("stroke","none")

d3.select(event.currentTarget)
.attr("stroke","black")
.attr("stroke-width",2)

updateProfile(d)

})


// PROFILE PANEL

function updateProfile(d){

d3.select("#profile_panel").html(`

<h3>Student Profile</h3>

<p><strong>Age:</strong> ${d.Age}</p>
<p><strong>Gender:</strong> ${d.Gender}</p>
<p><strong>Country:</strong> ${d.Country}</p>

<hr>

<p><strong>Academic Level:</strong> ${d.Academic_Level}</p>
<p><strong>Platform:</strong> ${d.Most_Used_Platform}</p>

<hr>

<div id="profile_viz"></div>

`)

drawProfileViz(d)

}


// PROFILE METRIC CHART

function drawProfileViz(d){

const metrics = [
{label:"Social Media Usage", value:d.Avg_Daily_Usage_Hours, field:"Avg_Daily_Usage_Hours"},
{label:"Sleep", value:d.Sleep_Hours_Per_Night, field:"Sleep_Hours_Per_Night"},
{label:"Mental Health", value:d.Mental_Health_Score, field:"Mental_Health_Score"}
]

const w = 240
const h = 120

const svg = d3.select("#profile_viz")
.append("svg")
.attr("width",w)
.attr("height",h)

metrics.forEach((m,i)=>{

const min = d3.min(data,d=>d[m.field])
const max = d3.max(data,d=>d[m.field])

const scale = d3.scaleLinear()
.domain([min,max])
.range([80,220])

const y = i*35+20

svg.append("text")
.attr("x",0)
.attr("y",y+5)
.attr("font-size",11)
.text(m.label)

svg.append("line")
.attr("x1",scale(min))
.attr("x2",scale(max))
.attr("y1",y)
.attr("y2",y)
.attr("stroke","#ddd")
.attr("stroke-width",4)

svg.append("circle")
.attr("cx",scale(m.value))
.attr("cy",y)
.attr("r",5)
.attr("fill","#4C78A8")

})

}

}