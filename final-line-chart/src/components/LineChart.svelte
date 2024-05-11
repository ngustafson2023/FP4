<script>
    import { scaleLinear, scaleOrdinal } from "d3-scale";
    export let chartWidth;
    export let chartHeight;
    export let data;
    export let xVar;
    export let yVars;
    export let color;
    import Tick from "./Tick.svelte"
    import Tooltip from "./Tooltip.svelte"
    import SimpleTooltip from "./SimpleTooltip.svelte"

    import { onMount } from 'svelte';
    let uniqueColors;

    let allValues = ['Alston'];

    onMount(() => {
      uniqueColors = Array.from(new Set(data.map(d => d[color])));
    });

    // console.log(allValues)

    function computeRelevantData(colorValue) {
      if (mousePosition.x !== null) {
        const xValue = computeSelectedXValue(mousePosition.x);
        // console.log(xValue)
        return data.find(d => d[xVar] === xValue && d[color] === colorValue);
      }
      return null;
    }

    let relevantData = {};

    $: {
      if (mousePosition.x !== null) {
        uniqueColors.forEach(colorValue => {
          relevantData[colorValue] = computeRelevantData(colorValue);
        });
      }
    }


    const paddings = {
      top: 50,
      left: 50,
      right: 50,
      bottom: 50,
    };

    const tickNumber = chartWidth > 480 ? 10 : 5;

    export let colorFunction;
        const colorScale = colorFunction === undefined
        ? scaleOrdinal().domain(color)
            .range([
                "#e41a1c", "#377eb8", "#4daf4a", "#984ea3", 
                "#ff7f00", "#f781bf", "#a65628", "#999999", "#8dd3c7", 
                "#bebada", "#fb8072", "#80b1d3", "#fdb462", 
                "#b3de69", "#fccde5", "#d9d9d9", "#bc80bd", 
                "#ccebc5", "#ffed6f", "#b15928", "#6a3d9a"
            ])
        : colorFunction;
    
    const xScale = scaleLinear()
        .domain([Math.min(...data.map((d) => d[xVar])), Math.max(...data.map((d) => d[xVar])),])
        .range([paddings.left, chartWidth - paddings.right]);
    
    const yScale = scaleLinear()
        .domain([
            Math.min(...data.map(d => Math.min(...yVars.map(yVar => d[yVar])))),
            Math.max(...data.map(d => Math.max(...yVars.map(yVar => d[yVar])))) * 1.05 // Multiplies the max value by 1.05
        ])
        .range([chartHeight - paddings.bottom, paddings.top])
        .nice(tickNumber);
    
    
    const yGrid = yScale.ticks(tickNumber)  
    const xGrid = xScale.ticks(tickNumber)

    const idContainer = 'svg-container-' + Math.random() * 1000000
let mousePosition = { x: null, y: null }
function followMouse(event) {
  // console.log(uniqueColors)
  const svg = document.getElementById(idContainer)
  if (svg === null) return
  const dim = svg.getBoundingClientRect()
  const positionInSVG = 
   { x: event.clientX - dim.left, y: event.clientY - dim.top }
  mousePosition =
    positionInSVG.x > paddings.left &&
    positionInSVG.x < chartWidth - paddings.right &&
    positionInSVG.y > paddings.top &&
    positionInSVG.y < chartHeight - paddings.bottom
      ? { x: positionInSVG.x, y: positionInSVG.y }
      : { x: null, y: null }
}
function removePointer() {
  mousePosition = { x: null, y: null }
}

function computeSelectedXValue(value) {
  let closest = data[0][xVar];
  let closestDistance = Math.abs(xScale(data[0][xVar]) - value);

  data.forEach(d => {
    const distance = Math.abs(xScale(d[xVar]) - value);
    if (distance < closestDistance) {
      closest = d[xVar];
      closestDistance = distance;
    }
  });

  return closest;
}
    </script>
    <svg 

    width={chartWidth} 
    height={chartHeight}     
    on:mousemove={followMouse}
    on:mouseleave={removePointer}
    id={idContainer}>



<!-- Title -->
<text x={chartWidth / 2} y={paddings.top / 2} text-anchor="middle" font-size="20px">Corporate Ownership Rate By Neighborhood</text>

<!-- X-axis line -->
<line
  x1={paddings.left}
  x2={chartWidth - paddings.right}
  y1={chartHeight - paddings.bottom}
  y2={chartHeight - paddings.bottom}
  stroke="black"
  stroke-width="2"
/>

<!-- Y-axis line -->
<line
  x1={paddings.left}
  x2={paddings.left}
  y1={paddings.top}
  y2={chartHeight - paddings.bottom}
  stroke="black"
  stroke-width="2"
/>

<!-- X-axis label -->
<text x={chartWidth / 2} y={chartHeight - paddings.bottom / 4} text-anchor="middle" font-size="15px">Year</text>

<!-- Y-axis label -->
<text transform={`translate(${paddings.left / 4}, ${chartHeight / 2}) rotate(-90)`} text-anchor="middle" font-size="15px">Corporate Ownership Rate</text>






     <g>
       <line
         x1={paddings.left}
         x2={chartWidth - paddings.right}
         y1={chartHeight - paddings.bottom}
         y2={chartHeight - paddings.bottom}
         stroke="black"
         stroke-width="2"
       />
       <line
         x1={paddings.left}
         x2={paddings.left}
         y1={paddings.top}
         y2={chartHeight - paddings.bottom}
         stroke="black"
         stroke-width="2"
       />
      </g>
      <g>
        {#each data as datum, i}
          {#if i < data.length - 1 && data[i].Neighborhood === data[i + 1].Neighborhood}
            {#each yVars as yVar}
              <line
                x1={xScale(data[i][xVar])}
                x2={xScale(data[i + 1][xVar])}
                y1={yScale(data[i][yVar])}
                y2={yScale(data[i + 1][yVar])}
                stroke={colorScale(data[i][color])}
                stroke-width="2"
              />
            {/each}
          {/if}
        {/each}
      </g>
      <g>
        {#each yGrid.slice(1) as gridLine}
          <Tick
            x={paddings.left}
            y={yScale(gridLine)}
            value={gridLine}
            direction={"horizontal"}
          />
        {/each}
      </g>
      <g>
        {#each xGrid as gridLine}
          <Tick
            x={xScale(gridLine)}
            y={chartHeight - paddings.bottom}
            value={gridLine}
            direction={"vertical"}
            format={false}
          />
        {/each}
      </g>

      {#if mousePosition.x !== null}
  <g
    transform=
      "translate({xScale(computeSelectedXValue(mousePosition.x))} 0)"
  >
    <line
      x1="0"
      x2="0"
      y1={paddings.top}
      y2={chartHeight - paddings.bottom - 2}
      stroke="black"
      stroke-width="1"
    />
    {#each uniqueColors as colorValue}
      {#if relevantData[colorValue]}
        <circle
          cx={0}
          cy={yScale(relevantData[colorValue][yVars[0]])}
          r="3"
          fill={colorScale(colorValue)}
        />
      {/if}
    {/each}
  </g>
{/if}

{#if mousePosition.x !== null}
  <Tooltip
    x={paddings.left + 25} 
    y={paddings.top} 
    title={"Year: " + computeSelectedXValue(mousePosition.x)}
    labels={uniqueColors}
    values={uniqueColors.map(colorValue => {
      const year = computeSelectedXValue(mousePosition.x);
      const dataPoint = data.find(d => d[xVar] === year && d[color] === colorValue);
      return dataPoint && dataPoint[yVars[0]] !== undefined ? dataPoint[yVars[0]] : 0;
    })}
    colorScale={colorScale}
    backgroundColor="black"
    textColor="white"
    opacity="0.5"
  />

{/if}

{#if mousePosition.x == null}
    <Tooltip
      labels={yVars}
      values={data.find(
        (d) => d[xVar] === computeSelectedXValue(mousePosition.x))}
      {colorScale}
      x={paddings.left + 25} 
      y={paddings.top} 
      backgroundColor={"black"}
      opacity="0.5"
      textColor={"white"}
      title={"Slide Mouse For Sorted Annual Values"}
      width="200"
      adaptTexts={false}
    />
  {/if}




    </svg>