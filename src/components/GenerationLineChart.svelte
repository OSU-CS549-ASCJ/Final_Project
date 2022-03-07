<script>
	import { onMount } from "svelte";
	import { VegaLite } from "svelte-vega";
	
	let data;
	let viewVL;
	let specVL = {
		$schema: "https://vega.github.io/schema/vega-lite/v5.json",
		data: {
			name: "table",
		},
		mark: {
			type: "line"
		},
		encoding: {
			x: { field: "date", type: "temporal" },
			y: { field: "price", type: "quantitative" },
			color: {
				field: "symbol", 
				type: "nominal",
                // Manual Scheme
				// scale: {
				// 	domain: ["MSFT", "AMZN", "IBM", "GOOG", "AAPL"],
				// 	range: ["#000000", "#000000", "#000000", "#000000", "#000000"]
				// }
                // Pre-defined Scheme
                // See https://vega.github.io/vega/docs/schemes/#categorical
                scale: {
					scheme: "accent"
				}
			}
		},
		width: 400
	};

	onMount(async () => {
		const fetched = await fetch("static/data_Project_1.json");
		let rows = await fetched.json();
		console.log(rows);

		data = {
			table: rows,
		};
	});

</script>
	

<div id="chart">

	{#if data !== undefined}
		<VegaLite {data} spec={specVL} bind:view={viewVL} />
	{/if}

</div>


<style>
</style>