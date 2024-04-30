<script>
    import { onMount } from 'svelte';
    import { fly } from 'svelte/transition';
  
    let bars = [
      { year: "2020 Eviction", value: 1400, visible: false },
      { year: "2021 Eviction", value: 2200, visible: false },
      { year: "2022 Eviction", value: 3400, visible: false },
      { year: "2023 Eviction", value: 3200, visible: false }
    ];
  
    const maxYValue = Math.max(...bars.map(bar => bar.value));
    const scaleHeight = 300 / maxYValue; // Adjust scale to fit container
  
    onMount(() => {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            let index = bars.findIndex(bar => bar.year === entry.target.dataset.year);
            bars[index].visible = true;
          }
        });
      }, {
        threshold: 0.5  // Triggers when 50% of the element is in view
      });
  
      document.querySelectorAll('.bar').forEach(el => {
        observer.observe(el);
      });
  
      return () => observer.disconnect();
    });
  </script>
  
  <style>
    .chart-container {
      display: flex;
      justify-content: space-around;
      align-items: flex-end;
      max-width: 600px;
      height: 400px;
      margin: auto;
      padding: 20px;
      background-color: #f0f0f0;
      position: relative;
    }
    .bar {
      width: 70px;
      background-color: steelblue;
      color: white;
      text-align: center;
      margin: 5px;
      transition: height 0.5s ease;
    }
    .label {
      position: absolute;
      bottom: -20px; /* adjust based on your layout */
    }
    .value-label {
      position: absolute;
      bottom: 100%; /* place above the bar */
      color: black;
    }
    .y-axis {
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 40px; /* adjust based on your layout */
      display: flex;
      flex-direction: column-reverse;
      justify-content: space-between;
    }
    .tick {
      position: relative;
      width: 100%;
      text-align: right;
      padding-right: 10px;
    }
  </style>
  
  <div class="chart-container">
    {#each bars as { year, value, visible }, index}
      <div class="bar-wrapper">
        <div data-year="{year}" class="bar" style="height: {visible ? value * scaleHeight + 'px' : '0px'};" in:fly="{{ y: 30, duration: 500, delay: index * 300, opacity: visible ? 1 : 0 }}">
          <span class="value-label">{value}</span>
        </div>
        <span class="label">{year}</span>
      </div>
    {/each}
    <div class="y-axis">
      <!-- Example for y-axis labels -->
      {#each Array(6) as _, i (i)} <!-- Generates 6 ticks -->
        <div class="tick">{Math.round(i * maxYValue / 5)}</div>
      {/each}
    </div>
  </div>
  