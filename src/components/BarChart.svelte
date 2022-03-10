<script>
	import { onMount } from "svelte";
	import { scaleLinear, scaleOrdinal } from "d3-scale";
    import { SelectedStates } from "../store.js"
    import { SelectedYear } from "../store.js"
	export const myName = "Alexander Barajas-Ritchie";	


	let instances;
	let data = [];
	let xScaleNew;
	let xScaleTicks = [];
	let colorScale;
	let year_selected = $SelectedYear // 
    console.log($SelectedYear)
	let states_selected = $SelectedStates // 
	let selected_sources = ["Coal", "Geothermal", "Hydroelectric Conventional", "Natural Gas", "Other", "Petroleum", 
								"Solar Thermal and Photovoltaic", "Other Biomass", "Wind", "Wood and Wood Derived Fuels"]
	let all_sources = ["Coal", "Geothermal", "Hydroelectric Conventional", "Natural Gas", "Other", "Petroleum", 
								"Solar Thermal and Photovoltaic", "Other Biomass", "Wind", "Wood and Wood Derived Fuels"]
	let generation_values = []
	let max = 0


	onMount(async () => {
		const fetched = await fetch("static/new_data.json");
		instances = (await fetched.json());
		
		// filter by year and states
		states_selected.forEach((state)=>{
			data.push({"State": state,"records": instances.filter((record) => { return record.YEAR == year_selected && record.STATE == state; })})
		})

		// data transformation
		data.forEach((state_data) => {

			let unique = [...new Set(state_data.records.map(item => item["ENERGY SOURCE"]))];
			if(selected_sources.length == 0){
				selected_sources = unique
			}
			else{
				unique = selected_sources
			}

			let temp = []
			unique.forEach((genType) => {
				if(genType != "Total"){
					let temp_data = instances.filter((data) => { return data["ENERGY SOURCE"] == genType && data.STATE == state_data.State;});
					let total = 0
					temp_data.forEach((record) => {
						total += record['GENERATION']
						if(total > max){ max = total }
					});
					temp.push({"Generation Type": genType, "Sum": total})
				}

				
			});
			generation_values.push({"State": state_data.State, "Totals":temp})
		});
		//console.log(generation_values)
		// console.log(max)
		
		
		xScaleNew = scaleLinear()
			.domain([0, max])
			.range([0, 400])

		xScaleTicks = xScaleNew.ticks(26);

		console.log(generation_values)
		console.log(max)
		
		// xScaleTicks = xScale.ticks(5);
		// let yScaleTicks = yScale.ticks(10);

	});


	function update_selected(source){
		if(selected_sources.includes(source)){
			//console.log("here")
			selected_sources = arrayRemove(selected_sources, source);
		}
		else{
			selected_sources.push(source)
			selected_sources = selected_sources
		}
	}

	function arrayRemove(arr, value) {
		return arr.filter(function(ele){ 
			return ele != value; 
	});

}

	function colorEnergy(value){
		if (value["Generation Type"] == "Coal"){return "black"}
		if (value["Generation Type"] == "Geothermal"){return "green"}
		if (value["Generation Type"] == "Hydroelectric Conventional"){return "blue"}
		if (value["Generation Type"] == "Natural Gas"){return "red"}
		if (value["Generation Type"] == "Other"){return "black"}
		if (value["Generation Type"] == "Petroleum"){return "orange"}
		if (value["Generation Type"] == "Solar Thermal and Photovoltaic"){return "yellow"}
		if (value["Generation Type"] == "Other Biomass"){return "gray"}
		if (value["Generation Type"] == "Wind"){return "light green"}
		if (value["Generation Type"] == "Wood and Wood Derived Fuels"){return "brown"}
		return 'black';
		}

	function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

}




</script>

<main>
	<div id="alex-view">


		<div id="sidebar" >
			<svg id="visualization" style="width: 1000px;">
				{#if instances !== undefined}
				<g transform="translate(0, 10)">
					<text> Toggle Energry Source </text>
					{#each all_sources as source, index}
						<rect x= "20" y = "{(10 * index) + 5}"
							on:click={()=>{
							update_selected(source);		
						}}
						width="5"
						height="5"
						class="{selected_sources.includes(source) ? "selected_check" : "not_checked"}"/>
						<text x= "30" y = "{(10 * index) + 10 }"> {source}</text>
					{/each}
		
				</g>
				<g transform="translate(0, 70)">
					{#each generation_values as state, i}
					<text x= "19" y = "{60 + (i * 150)}"> {state.State}</text>
						{#each state.Totals as energy, index}
							{#if selected_sources.includes(energy["Generation Type"])}
								<g transform="translate(100, {index * 10 + 50 + (i * 150)})">
									<rect class="bar" x= "120" y="0" 
										width={xScaleNew(energy.Sum)}
										height = "8"	
										style="fill: {colorEnergy(energy)}" />
									<text x= "-30" y = "9"> {energy["Generation Type"]}</text>
									{#each xScaleTicks as tick}						
										<line class="tick"
											x1={120 + xScaleNew(tick)}
											y1= "0"
											x2={120+ xScaleNew(tick)}
											y2= "5"
											/>
									{/each}

								</g>
							{/if}

						{/each}
					{/each}

					{#each xScaleTicks as tick}						
						<text transform="translate({220 + xScaleNew(tick)}, 40) rotate(-45)" style="font-size:8">
							{tick}
						</text>
						<line class="tick"
							x1={220 + xScaleNew(tick)}
							y1="40"
							x2={220+ xScaleNew(tick)}
							y2="45"
							/>
					{/each}
					<line class="tick"
						x1="220" y1="45"
						x2={650} y2="45" />

					<line class="tick"
						x1="220" y1="{40}"
						x2="220" y2="450" />
				</g>
				{/if}
			</svg>
		</div>
</div>

</main>

<style>
    .tick {
        stroke: gray;
    }
	.inside_tick {
        stroke: "gray";
    }
    h1 {
        font-size: 1.5rem;
    }
    svg#visualization {
        width: 600px;
        height: 600px;
    }
    text {
        font-size: 0.6rem;
    }
    .bar {
        fill: steelblue;
    }
	#sidebar, #toggle-view {
		display: flex;
		flex-direction: column;
	}

	rect.selected_check{
		fill: black;
		stroke: gray; 
	}
	rect.not_checked{
		fill: gray;
		stroke: gray; 
	}

 
</style>