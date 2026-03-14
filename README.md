# Making Of: Social Media & Adolescent Well-Being Data Story
**by Maya McPartland**

View it here: https://visdesignstudies.github.io/module-two-storytelling-remix-mayamcp5/ 
---

## The Original Story

**Source:** [Pew Research Center, 2022](https://www.pewresearch.org/internet/2022/08/10/teens-social-media-and-technology-2022/)

I knew I wanted to work with a data story that focused on one of my interests, and social media's effects on adolescent development and mental health is an area of research I am currently involved in at UNC. So when I came across the Pew Research Center's 2022 report on teens and social media, it immediately stood out to me. I appreciated the fact that there was a lot of data to work with (so much that I didn't actually use all of it for my version). I primarily wanted to focus on the perspectives of teens themselves and the positive and negative effects they report, rather than mixing in the parent data that the original piece leaned on pretty heavily.

---

## Design Process

### Choosing the Story Structure

The original story blended both parents' and teens' perspectives throughout. I focused mine on teens only, which gave the narrative a cleaner shape: start broad, zoom into the negatives, then the positives, then finally look at individuals. I also decided to add a second dataset to introduce a more individual-level view, which I thought made the story feel more personal and less like a summary of survey statistics.

For the overall format, I chose scrollytelling over a standard magazine-style layout. My main reason was that in the original piece, the visualizations felt more like sidekicks (they illustrated what the text had already said, and you could honestly skip them and not miss much). I wanted the visualizations to be the main event, with the text there to guide you through them rather than the other way around. Scrollytelling centers the charts in a way that the original layout did not. It also holds the reader's attention better and feels more compelling to work through, since it's less of a text dump and more of an actual experience.

For the individual visualizations, I didn't sketch things out formally beforehand. Instead, I referenced previous D3 work I've done and based each chart on structures I had already worked with that fit the shape of the data. For example, I'd used stacked bars before for similarly structured response data, and I had worked with scatter plots with interactive panels in a previous project.

### Visualization Design Decisions

#### Viz 0: Donut Chart (Screen Time)

I wanted a clean, simple way to open the story before diving into anything complicated. A donut chart felt right for showing the percentage breakdown of how teens feel about their own screen time. I felt that the "part of a whole" framing was immediately intuitive, and it worked well as a launching point. I added a hover interaction that slightly expands each slice, which is a small thing but signals early on that the piece responds to you.

#### Viz 1: Dumbbell Chart + Stacked Bars (View Coordination)

This section started as a grouped bar chart comparing overall vs. personal perception, but grouped bars felt flat. You could see the numbers but the relationship between them wasn't the focus. I switched to a dumbbell chart because the connecting line between the two dots makes the *gap* the visual object, which is actually the most interesting thing in this data. Teens consistently think social media is worse for other teens than for themselves, and the dumbbell makes that visible at a glance. I connected the dumbbell chart to the life impacts stacked bar below it through view coordination. Clicking a category in the top chart filters the segments in the bottom one.

#### Viz 2 & 3: Stacked Bar Charts (Negative / Positive Experiences)

I used the same stacked bar structure for both the negative and positive experience charts deliberately, because having them look the same makes them easy to compare, and the parallel format reinforces that you're looking at two sides of the same coin. Stacked bars also handle the three-level response scale (a lot / a little / none) better than most alternatives; you can see not just whether something happened but how intensely it was felt. Both charts are sorted by total negative or positive experience so the most impactful things appear at the top. The scroll-triggered highlighting of the "a lot" segments was a way to draw attention to severity without having to spell it out in the text.

#### Viz 4: Scatter-Type Plot with Profile Panel

After three charts of aggregated survey data, I wanted to end with something that felt more individual and personal. I brought in a second dataset of individual students and put mental health score on the x-axis against daily usage hours on the y-axis so readers can look for the pattern themselves. The clickable profile panel on the right was the part I was most excited about: clicking a dot and seeing a real student's details makes it feel less like you're looking at data and more like you're looking at people. This is something I enjoyed in a lot of data stories we examined in class, although they were usually executed in a more artistic way. Since I didn't have the time or ability for that, the profile panel was my way of doing this.

---

## Data Sources & Tools

| Dataset | Source |
|---|---|
| Teen social media perception (overall, personal, life impacts) | Pew Research Center 2022 |
| Negative / positive experiences | Pew Research Center 2022 |
| Individual student data | [Social Media Addiction vs Relationships (Kaggle)](https://www.kaggle.com/) |

- **Built with:** D3, HTML/CSS/JS
- **AI tools used:** Claude was used for debugging and help with the CSS/JS for the scrollytelling layout.

---

## New Techniques Addendum

### What I Changed: Scrollytelling

The original approach to the data story put charts inline with text. Figurs appeared when the referenced, you could look at it (or not) and keep reading. The visualization is there to support the writing. I replaced that with scrollytelling: the chart panel stays fixed on the left while the reader scrolls through text steps on the right, and the chart changes in response to where they are in the story.

Some ways I implemented this:
- Charts animate or filter as specific steps scroll into view (for example, the "a lot" segments highlight when the reader reaches the step about severity in the negative experiences section)
- The dumbbell chart and the life impacts chart are view-coordinated, so clicking a dot filters the chart below it
- The life impacts chart is hidden until the reader reaches the step where it's introduced, so the reveal is timed to the narrative

### How This Changes the Reader's Experience

**The visualizations are the main event.** In the original layout, you could skim the charts or skip them entirely and still follow the story. In this scrollytelling layout, the chart is always in view (it's literally taking up half the screen). The text exists to guide your reading of the chart, not the other way around. That shift in emphasis was the main reason I chose this format.

**It holds attention better.** Something happening on screen as you scroll is just more engaging than a static page. The transitions and highlights give the reader something to look forward to as they move through the piece, which makes it feel less like reading and more like an actual experience.

**It asks something of you.** The consistent need to scroll and other interactions require the reader to do something. That's a different kind of engagement than passive reading. I think it's especially appropriate for a topic like teen mental health, where "oh interesting" and scrolling on feels like the wrong response.

**The honest tradeoff.** Scrollytelling does slightly constrain the reader more than a free layout does. Someone who wants to compare the negative and positive charts side by side basically can't. This is something I would like to improve upon if I had more time, but I felt the narrative "story" structure was more impactful than the need to directly compare the numbers.
