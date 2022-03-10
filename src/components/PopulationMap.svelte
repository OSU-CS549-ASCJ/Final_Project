<script>
	import { onMount } from "svelte";
	import { VegaLite } from "svelte-vega";
	
	let data;
	let data2;
	let view;

	let selectedYear = 2010;
    let selectedMapEnergySource = "Total"

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
	let spec = {
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
				field: "GENERATION",
				type: "quantitative",
                // scale: {
				// 	domain: [0, 100000000],
				// 	range: ["#000000", "#ffffff"]
				// }
                // scale: {
				// 	domain: [0, 10000000, 15000000, 20000000, 25000000, 30000000],
				// 	range: ["#dddddd", "#aaaaaa", "#999999", "#666666", "#333333", "#000000"]
				// }
                scale: {
                    scheme: "turbo"
                }
			}
		},
		width: 1000
	};

	onMount(async () => {
		const fetched = await fetch("static/state_populations.json");
		const fetched2 = await fetch("static/new_data.json");
		let rows = await fetched.json();
		let rows2 = await fetched2.json();
		console.log(rows);

		let formattedData = rows2.filter(record => record.YEAR == selectedYear && 
												record["ENERGY SOURCE"] == selectedMapEnergySource &&
                                                record["TYPE OF PRODUCER"] == "Total Electric Power Industry" &&
                                                record["STATE_ABBREV"] !== "US-TOTAL" &&
                                                record.MONTH == 1.0);
		console.log(formattedData)

		for (let i = 0; i < formattedData.length; i++) {
			rows[i].GENERATION = formattedData[i].GENERATION;
		}

		data = {
			table: rows,
		};
		data2 = {
			table: formattedData,
		};
	});
</script>
	

<div id="map">
	{#if data !== undefined}
		<VegaLite {data} spec={spec} bind:view={view} />
	{/if}
</div>


<style>
	#map 
	{
		border: 10px;
		border-style: dashed;
		width: auto;
		height: 500px;
	}
</style>