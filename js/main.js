// main.js
Promise.all([
  d3.csv("data/overall.csv"),
  d3.csv("data/personal.csv"),
  d3.csv("data/life_impacts.csv"),
  d3.csv("data/negative.csv"),
  d3.csv("data/positive.csv"),
  d3.csv("data/usage_time.csv"),
  d3.csv("data/mental_health_analysis.csv")
]).then(function([
  overall,
  personal,
  impacts,
  negative,
  positive,
  time,
  analysis
]){

  drawIntro(time)
  drawOverallViz(overall, personal, impacts)
  drawIndividualsViz(analysis)
  drawNegativeViz(negative)
  drawPositiveViz(positive)

})