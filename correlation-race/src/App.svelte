<script>
	import Scroll from "./Scrolly.svelte";
	import { scaleLinear, scaleBand } from "d3-scale";
	import { tweened } from "svelte/motion";
  
	let width = 500; // Increase width for better layout
	let height = 450; // Increase height to fit labels
  
	// Define the data for each group
	const data = [
	  {
		group: 'Black/African American',
		values: [
		  { neighborhood: 'Allston', correlation: 0.3629766438 },
		  { neighborhood: 'Brighton', correlation: 0.1953718298 },
		  { neighborhood: 'Charlestown', correlation: 0.5332275128 },
		  { neighborhood: 'Dorchester', correlation: -0.7312876672 },
		  { neighborhood: 'East Boston', correlation: 0.1530103701 },
		  { neighborhood: 'Fenway', correlation: 0.2974432758 },
		  { neighborhood: 'Hyde Park', correlation: 0.5600015704 },
		  { neighborhood: 'Jamaica Plain', correlation: -0.5599351162 },
		  { neighborhood: 'Longwood', correlation: -0.7695963937 },
		  { neighborhood: 'Mattapan', correlation: -0.9646712502 },
		  { neighborhood: 'Roslindale', correlation: 0.4049929324 },
		  { neighborhood: 'Roxbury', correlation: -0.9335919788 },
		  { neighborhood: 'South Boston', correlation: 0.3275597246 },
		  { neighborhood: 'South Boston Waterfront', correlation: 0.4530057659 },
		  { neighborhood: 'West Roxbury', correlation: 0.6475668172 }
		]
	  },
	  {
		group: 'Hispanic',
		values: [
		  { neighborhood: 'Allston', correlation: 0.08848868223 },
		  { neighborhood: 'Brighton', correlation: 0.2460559184 },
		  { neighborhood: 'Charlestown', correlation: -0.1287627187 },
		  { neighborhood: 'Dorchester', correlation: 0.957462843 },
		  { neighborhood: 'East Boston', correlation: 0.3383558425 },
		  { neighborhood: 'Fenway', correlation: 0.5629005714 },
		  { neighborhood: 'Hyde Park', correlation: 0.7965461648 },
		  { neighborhood: 'Jamaica Plain', correlation: -0.9047876238 },
		  { neighborhood: 'Longwood', correlation: -0.693455301 },
		  { neighborhood: 'Mattapan', correlation: 0.9090211167 },
		  { neighborhood: 'Roslindale', correlation: 0.7215503187 },
		  { neighborhood: 'Roxbury', correlation: 0.8418994323 },
		  { neighborhood: 'South Boston', correlation: 0.6330124536 },
		  { neighborhood: 'South Boston Waterfront', correlation: 0.8847867417 },
		  { neighborhood: 'West Roxbury', correlation: 0.8452433068 }
		]
	  },
	  {
		group: 'White',
		values: [
		  { neighborhood: 'Allston', correlation: -0.9624666906 },
		  { neighborhood: 'Brighton', correlation: -0.9655104861 },
		  { neighborhood: 'Charlestown', correlation: -0.8910965281 },
		  { neighborhood: 'Dorchester', correlation: -0.5975292229 },
		  { neighborhood: 'East Boston', correlation: -0.4907069798 },
		  { neighborhood: 'Fenway', correlation: -0.9736532165 },
		  { neighborhood: 'Hyde Park', correlation: -0.8163666047 },
		  { neighborhood: 'Jamaica Plain', correlation: 0.5761506642 },
		  { neighborhood: 'Longwood', correlation: 0.6621081944 },
		  { neighborhood: 'Mattapan', correlation: -0.6734930337 },
		  { neighborhood: 'Roslindale', correlation: -0.7651827337 },
		  { neighborhood: 'Roxbury', correlation: 0.9052012015 },
		  { neighborhood: 'South Boston', correlation: -0.7769698486 },
		  { neighborhood: 'South Boston Waterfront', correlation: -0.7436286355 },
		  { neighborhood: 'West Roxbury', correlation: -0.8309620779 }
		]
	  }
	];
  
	let currentData = data[0].values;
	const xScale = scaleBand()
	  .domain(currentData.map(d => d.neighborhood))
	  .range([0, width])
	  .padding(0.1);
  
	const yScale = scaleLinear()
	  .domain([-1, 1])
	  .range([height, 0]);
  
	let currentStep;
	const steps = ["<p>Black/African American</p>", "<p>Hispanic</p>", "<p>White</p>"];
  
	$: if (currentStep !== undefined) {
	  currentData = data[currentStep].values;
	  xScale.domain(currentData.map(d => d.neighborhood));
	}
  </script>
  
  <section>
	<div class="chart">
	  <svg {width} {height} style="overflow: visible;">
		<text x={width / 2} y="-20" fill="black" font-size="16px" text-anchor="middle">
			Correlation Between Corporate Ownership and Population Race
		  </text>
		{#each currentData as d}
		  <rect
			x={xScale(d.neighborhood)}
			y={yScale(Math.max(0, d.correlation))}
			width={xScale.bandwidth()}
			height={Math.abs(yScale(d.correlation) - yScale(0))}
			fill={d.neighborhood === 'Longwood' ? "red" : "grey"}
		  />
				  {#if d.neighborhood === 'Longwood'}
					<text
					  x={xScale(d.neighborhood) + xScale.bandwidth() / 2}
					  y={yScale(d.correlation) - 5} 
					  fill="black"
					  font-size="10px"
					  text-anchor="middle">
					  {d.correlation.toFixed(2)}
					</text>
			  {/if}
		{/each}
  
		<!-- X-axis -->
		<g transform={`translate(0, ${height})`}>
		  {#each currentData as d}
			<text
			  x={xScale(d.neighborhood) + xScale.bandwidth() / 2}
			  y={10}
			  transform={`rotate(-90, ${xScale(d.neighborhood) + xScale.bandwidth() / 2}, 10)`}
			  fill= {d.neighborhood === 'Longwood' ? "red" : "black"}
			  font-size="10px"
			  text-anchor="end">
			  {d.neighborhood}
			</text>
		  {/each}
		</g>
  
		<!-- Y-axis and Gridlines -->
			  <g transform="translate(0, 0)">
				<line x1="0" y1="0" x2="0" y2={height} stroke="black" />
				{#each Array(11) as _, i}
				  <line
					x1="0"
					y1={yScale(-1 + i * 0.2)}
					x2={width}
					y2={yScale(-1 + i * 0.2)}
					stroke="#e8e8e8"
					stroke-dasharray="2,2"
				  />
				  <text x={-40} y={yScale(-1 + i * 0.2)} fill="black" font-size="12px" dy=".32em">
					{(-1 + i * 0.2).toFixed(1)}
				  </text>
				{/each}
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
	}
  
	.step-content {
	  background: transparent;
	  color: transparent;
	  border-radius: 5px;
	  padding: 0.5rem 1rem;
	  display: flex;
	  flex-direction: column;
	  justify-content: center;
	  transition: background 500ms ease;
	  box-shadow: 1px 1px 10px transparent(0, 0, 0, 0.2);
	  z-index: 10;
	}
  
	.step.active .step-content {
	  background: transparent;
	  color: transparent;
	}
  </style>
  
  