<script>
    export let x;
    export let y;
    export let value;
    export let direction;
    export let format = true;
    export let formatFunction;
    export let tickType = 'x';

    const xTranslation = direction === "horizontal" ? x - 10 : x;
    
    function nFormatter(num, digits) {
      const lookup = [
          { value: 1, symbol: "", format: (num, digits) => num.toFixed(digits) },
          { value: 1e3, symbol: "k", format: (num, digits) => (num / 1e3).toFixed(digits) },
          { value: 1e6, symbol: "M", format: (num, digits) => (num / 1e6).toFixed(digits) },
          { value: 1e9, symbol: "G", format: (num, digits) => (num / 1e9).toFixed(digits) },
          { value: 1e12, symbol: "T", format: (num, digits) => (num / 1e12).toFixed(digits) },
          { value: 1e15, symbol: "P", format: (num, digits) => (num / 1e15).toFixed(digits) },
          { value: 1e18, symbol: "E", format: (num, digits) => (num / 1e18).toFixed(digits) },
          { value: -1, symbol: "%", format: (num, digits) => (num * 100).toFixed(digits) } // Handle percentage as a special case
      ];
      const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;

      var item = lookup
          .slice()
          .reverse()
          .find(function (item) {
              return tickType === 'y' ? item.value === -1 : num >= item.value;
          });

      return item
          ? item.format(num, digits).replace(rx, "$1") + item.symbol
          : num.toFixed(digits).replace(rx, "$1");
    }

    const valueLabel = formatFunction !== undefined 
        ? formatFunction(value)
        : format
          ? nFormatter(value, tickType === 'y' ? 0 : 1) // Use 0 decimal places for percentage
          : value;
</script>

    <g transform={"translate(" + xTranslation + ", " + y + ")"}>
      <text
        y={direction === "horizontal" ? 0 : 20}
        font-size="13px"
        text-anchor={direction === "horizontal" ? "end" : "middle"}
        alignment-baseline="middle">
         {valueLabel}
      </text>
      {#if direction === "horizontal"}
        <line 
          x1={2} 
          x2={8} 
          y1={0} 
          y2={0} 
          stroke="black" 
          stroke-width="1" />
      {:else}
        <line 
          x1={0} 
          x2={0} 
          y1={2} 
          y2={8} 
          stroke="black" 
          stroke-width="1" />
      {/if}
    </g>