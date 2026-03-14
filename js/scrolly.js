// scrolly.js - handles the scrollytelling behavior
// uses IntersectionObserver to watch when text steps enter/leave the viewport
// and trigger chart transitions accordingly

document.addEventListener("DOMContentLoaded", () => {

  // watch each .step element and activate it when it's in the middle of the screen
  const stepEls = document.querySelectorAll(".step")

  const stepObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const content = entry.target.querySelector(".step-content")
      if (!content) return

      if (entry.isIntersecting) {
        content.classList.add("is-active")
        handleStepEnter(entry.target.dataset.step)
      } else {
        content.classList.remove("is-active")
      }
    })
  }, {
    // only trigger when the step is roughly centered in the viewport
    rootMargin: "-30% 0px -30% 0px",
    threshold: 0
  })

  stepEls.forEach(el => stepObserver.observe(el))

  // fade in elements as they scroll into view
  const fadeEls = document.querySelectorAll(".fade-in")

  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible")
        fadeObserver.unobserve(entry.target)  // only animate once
      }
    })
  }, { threshold: 0.15 })

  fadeEls.forEach(el => fadeObserver.observe(el))

})

// called whenever a new step scrolls into view
function handleStepEnter(step) {
  if (!step) return

  switch(step) {

    // section 1: overall perception + life impacts

    case "1-1":
      // only show the dumbbell chart first
      d3.select("#overall_chart").style("display", "block")
      d3.select("#life_chart").style("display", "none")
      d3.select("#sticky-1-label").text("Overall Perception of Social Media")
      d3.select("#sticky-1-note").text("Red = teens in general  ·  Blue = me personally")
      break

    case "1-2":
      d3.select("#overall_chart").style("display", "block")
      d3.select("#life_chart").style("display", "none")
      d3.select("#sticky-1-note").text("Click a dot to highlight related life impacts →")
      break

    case "1-3":
      // reveal the stacked bar chart once the reader reaches this step
      d3.select("#overall_chart").style("display", "block")
      d3.select("#life_chart").style("display", "block")
      d3.select("#sticky-1-label").text("Overall Perception  ·  Life Area Impacts")
      d3.select("#sticky-1-note").text("Click a dot above to filter the chart below")
      break

    // section 2: negative experiences

    case "2-1":
      highlightNegativeBars(null)
      break

    case "2-2":
      highlightNegativeBars("all")
      break

    case "2-3":
      // highlight just the "a lot" segments at this step
      highlightNegativeBars("a lot")
      break

    // section 3: positive experiences

    case "3-1":
      highlightPositiveBars(null)
      break

    case "3-2":
      highlightPositiveBars("all")
      break

    case "3-3":
      // highlight just the "a lot" segments at this step
      highlightPositiveBars("a lot")
      break
  }
}

// these call the highlight functions exposed by viz2 and viz3
function highlightNegativeBars(mode) {
  if (typeof window.negativeHighlight === "function") {
    window.negativeHighlight(mode)
  }
}

function highlightPositiveBars(mode) {
  if (typeof window.positiveHighlight === "function") {
    window.positiveHighlight(mode)
  }
}