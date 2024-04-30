<script>
    import { onMount } from 'svelte';
  
    let bars = [
      { year: "2020", value: 1400, visible: false },
      { year: "2021", value: 2200, visible: false },
      { year: "2022", value: 3400, visible: false },
      { year: "2023", value: 3200, visible: false }
    ];
  
    let lastIndex = 0; // Tracks the index of the last revealed bar
    let lastScrollTop = window.scrollY; // Start with current scroll position
    let cumulativeScroll = 0; // Tracks the cumulative amount of scroll
    const threshold = 10; // Amount of pixels scrolled before revealing the next bar
  
    function setupScroll() {
      const showNextBar = () => {
        const currentScrollY = window.scrollY;
        // Calculate how much was scrolled since last check
        let scrollDelta = Math.abs(currentScrollY - lastScrollTop);
  
        // Accumulate scrolled amount
        cumulativeScroll += scrollDelta;
  
        // Check if the cumulative scroll has passed the threshold
        if (cumulativeScroll >= threshold && lastIndex < bars.length) {
          bars[lastIndex].visible = true;
          lastIndex++;
          cumulativeScroll = 0; // Reset cumulative scroll after showing a bar
        }
  
        lastScrollTop = currentScrollY; // Update the last scroll position
      };
  
      // Attach the event listener
      window.addEventListener('scroll', showNextBar, { passive: true });
  
      // Cleanup function to remove the event listener
      return () => {
        window.removeEventListener('scroll', showNextBar);
      };
    }
  
    onMount(() => {
      return setupScroll();
    });
  </script>
  
  <style>
    .chart-container {
      display: flex;
      justify-content: space-around;
      align-items: flex-end;
      height: 400px;
      margin: auto;
      position: relative;
      padding-top: 20px;
    }
    .bar {
      width: 50px;
      background-color: steelblue;
      transition: height 0.5s ease;
    }
  </style>
  
  <div class="chart-container">
    {#each bars as { year, value, visible }}
      <div class="bar" style="height: {visible ? value * 0.1 + 'px' : '0px'}">
        {year}
      </div>
    {/each}
  </div>
  