<script>
  import Scroll from "./Scrolly.svelte";
  import { tweened } from "svelte/motion";
  import { scaleLinear, scaleBand } from "d3-scale";

  let data = [
    { a: 0, b: 1926, c: 1926, d: 1926, e: 1926},
    { a: 0, b: 0, c: 2286, d: 2286, e: 2286},
    { a: 0, b: 0, c: 0, d: 3484, e: 3484},
    { a: 0, b: 0, c: 0, d: 0, e: 4289},
  ];

  let width = 500;
  let height = 450;
  let margin = {top: 40, right: 30, bottom: 50, left: 60};

  let xScale = scaleBand()
    .domain(data.map((_, index) => index))
    .range([0, width - margin.left - margin.right])
    .padding(0.1);

  let maxValue = Math.max(...data.flatMap(d => [d.a, d.b, d.c, d.d, d.e]));
  let roundedMax = Math.ceil(maxValue / 1000) * 1000;

  let yScale = scaleLinear()
    .domain([0, roundedMax])
    .range([height - margin.top - margin.bottom, 0]);

  const tweenedValues = tweened(data.map((d) => d.a));

  let currentStep;
  const steps = ["1", "2", "3", "4", "5"];

  $: if (currentStep == 0) {
    tweenedValues.set(data.map((d) => d.a));
  } else if (currentStep == 1) {
    tweenedValues.set(data.map((d) => d.b));
  } else if (currentStep == 2) {
    tweenedValues.set(data.map((d) => d.c));
  } else if (currentStep == 3) {
    tweenedValues.set(data.map((d) => d.d));
  } else if (currentStep == 4) {
    tweenedValues.set(data.map((d) => d.e));
  }
</script>

<section>
  <div class="chart">
    <svg {width} {height} style="overflow: visible;">
      <g transform={`translate(${margin.left}, ${margin.top})`}>
        <text x={(width - margin.left - margin.right) / 2} y="-10" style="text-anchor: middle; font-weight: bold; font-size: 16px;">
          Boston Evictions
        </text>        
        {#each data as d, index}
          <rect
            x={xScale(index)}
            y={yScale($tweenedValues[index])}
            width={xScale.bandwidth()}
            height={height - margin.top - margin.bottom - yScale($tweenedValues[index])}
            fill="steelblue"
            stroke="#000000"
          />
          {#if $tweenedValues[index] === data[index][['a', 'b', 'c', 'd', 'e'][currentStep]] && $tweenedValues[index] !== 0}
            <text x={xScale(index) + xScale.bandwidth() / 2} y={yScale($tweenedValues[index]) - 5}
              style="text-anchor: middle; fill: black;">
              {$tweenedValues[index]}
            </text>
          {/if}
        {/each}
        <!-- X-Axis -->
        <g transform={`translate(0, ${height - margin.top - margin.bottom})`}>
          {#each data as _, index}
            <text x={xScale(index) + xScale.bandwidth() / 2} y={margin.bottom / 2} dy=".75em" style="text-anchor: middle;">
              {2020 + index}
            </text>
          {/each}
          <line x1="0" x2={width - margin.left - margin.right} stroke="black"/>
        </g>
        <!-- Y-Axis -->
        <g>
          {#each Array((roundedMax / 1000) + 1).fill(null).map((_, i) => i * 1000) as value}
            <g transform={`translate(0, ${yScale(value)})`}>
              <line x1="-5" x2="0" stroke="black"/>
              <text x="-10" dy=".35em" style="text-anchor: end;">{value}</text>
            </g>
          {/each}
          <line y1="0" y2={height - margin.top - margin.bottom} stroke="black"/>
        </g>
      </g>
    </svg>
  </div>

  <Scroll bind:value={currentStep}>
    {#each steps as text, i}
      <div class="step" class:active={currentStep === i}>
        <div class="step-content">
          {@html text}
        </div>
      </div>
    {/each}
  </Scroll>
</section>

<style>
  /* The fixed chart */
  .chart {
    width: 500px;
    height: 450px;
    position: sticky;
    top: 10%;
    margin: auto;
  }

  /* Scrollytelling CSS */
  .step {
    height: 80vh;
    display: flex;
    place-items: center;
    justify-content: center;
    visibility: hidden;
  }

  .step-content {
    background: transparent;
    color: transparent;
    padding: 0.5rem 1rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    transition: background 500ms ease;
    z-index: 10;
  }

  .step.active .step-content {
    background: transparent;
    color: transparent;
  }

  text {
    font: 12px sans-serif;
  }
</style>
