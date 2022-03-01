<script>
	import { onMount } from "svelte";
	import { VegaLite } from "svelte-vega";
	
	let data;
	let viewVL1;
	let viewVL2;

	let specGeoTransform = [
		{
			lookup: "id",
			from: {
				data: {
					"url": "static/us-10m.json",
					"format": {
						"type": "topojson",
						"feature": "states"
					}
				},
				key: "id"
			},
			as: "geo"
		}
	]
	let specVL1 = {
		$schema: "https://vega.github.io/schema/vega-lite/v5.json",
		data: {
			name: "table",
		},
        transform: specGeoTransform,
        projection: {type: "albersUsa"},
		mark: "geoshape",
		encoding: {
			shape: { field: "geo", type: "geojson" },
			color: {
				field: "population",
				type: "quantitative",
                scale: {
					domain: [0, 100000000],
					range: ["#000000", "#ffffff"]
				}
                // scale: {
				// 	domain: [0, 20000000, 40000000, 60000000, 80000000, 100000000],
				// 	range: ["#dddddd", "#aaaaaa", "#999999", "#666666", "#333333", "#000000"]
				// }
                // scale: {
                //     scheme: "turbo"
                // }
			}
		},
		width: 600
	};
	let specVL2 = {
		$schema: "https://vega.github.io/schema/vega-lite/v5.json",
		data: {
			name: "table",
		},
        transform: specGeoTransform,
        projection: {type: "albersUsa"},
		mark: "geoshape",
		encoding: {
			shape: { field: "geo", type: "geojson" },
			color: {
				field: "change",
				type: "quantitative",
                // scale: {
				// 	domain: [-3, 3],
				// 	range: ["#ffffff", "#000000"]
				// }
                // scale: {
				// 	domain: [-3, -2, -1, 0, 1, 2, 3],
				// 	range: ["#ffffff", "#dddddd", "#aaaaaa", "#999999", "#666666", "#333333", "#000000"]
				// }
                scale: {
                    scheme: "turbo"
                }
			}
		},
		width: 600
	};

	onMount(async () => {
		const fetched = await fetch("static/state_populations.json");
		let rows = await fetched.json();
		console.log(rows);

		data = {
			table: rows,
		};
	});
</script>
	

<div id="chart">
	{#if data !== undefined}
		<VegaLite {data} spec={specVL1} bind:view={viewVL1} />
		<VegaLite {data} spec={specVL2} bind:view={viewVL2} />
	{/if}
</div>


<style>
	#chart 
	{
		border: 10px;
		border-style: dashed;
		width: auto;
		height: 50px;
	}
</style>