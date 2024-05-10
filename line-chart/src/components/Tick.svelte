<script>
  import { onMount } from "svelte";
  export let x;
  export let y;
  export let labels;
  export let values;
  export let colorScale;
  export let width = 150;
  export let backgroundColor = "white";
  export let textColor = "black";
  export let opacity = 1;
  export let title;
  export let adaptTexts = true;
  
  let sortedLabels = [];
  let sortedValues = [];

  onMount(() => {
    // Create an array of objects with label and value
    let combined = labels.map((label, index) => ({
      label: label,
      value: values[index]
    }));

    // Sort the array by value in descending order
    combined.sort((a, b) => b.value - a.value);

    // Extract the sorted labels and values
    sortedLabels = combined.map(item => item.label);
    sortedValues = combined.map(item => item.value);
  });

  const step = 25;
  const paddingLeft = 15;
  const paddingRight = 15;
  const lineLength = 10;
  const spaceBetweenLineText = 3;
  const idContainer = "svg-legend-" + Math.random() * 10000;
  const maxTextLength = width - paddingLeft - lineLength - spaceBetweenLineText - paddingRight;
  let computedWidth = width;
  const tooltipX = paddingLeft + 3; // Fixed position for the tooltip
  const tooltipY = step; // Fixed position for the tooltip
</script>

<svg x={x - 10} {y} width={computedWidth + 2} height="400" id={idContainer}>
  <rect
    x="1"
    y="1"
    width={computedWidth}
    height={(sortedLabels.length + 1 + (title !== undefined ? 1 : 0)) * step}
    stroke="black"
    stroke-width="1"
    fill={backgroundColor}
    {opacity}
  />
  {#if title !== undefined}
    <text
      x={tooltipX} 
      y={tooltipY}
      alignment-baseline="middle"
      font-size="8"
      fill={textColor}>{title}</text>
  {/if}
  {#each sortedLabels as label, i}
  <g>
    <line
      x1={paddingLeft}
      x2={paddingLeft + lineLength}
      y1={(i + 1 + (title !== undefined ? 1 : 0)) * step - 1}
      y2={(i + 1 + (title !== undefined ? 1 : 0)) * step - 1}
      stroke={colorScale(label)}
      stroke-width="3"/>
    <text
      x={paddingLeft + lineLength + spaceBetweenLineText}
      y={(i + 1 + (title !== undefined ? 1 : 0)) * step}
      alignment-baseline="middle"
      font-size="8"
      fill={textColor}
      class="legend-labels">
        {label}
        {sortedValues[i] !== undefined
            ? ": " + (sortedValues[i] * 100).toFixed(1) + '%'
            : ": N/A"}
    </text>
   </g>
  {/each}
</svg>
