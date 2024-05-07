<script>
	import ChartContainer from './components/ChartContainer.svelte';
	import { weddings } from './data/weddings';
	import { ownershipData } from './data/OwnershipData';
</script>
	<main>
		<ChartContainer type={'lineChart'} chartProps={{ chartWidth: 640, chartHeight: 500, data: ownershipData, xVar: 'Year', yVars: ['corp_own_rate'], color: 'Neighborhood'}}/>
	</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>