<script>
	import { onMount } from "svelte";
	import * as d3 from "d3";
	import { SelectedStatesAbbrv } from "../store.js"
    import { SelectedYear } from "../store.js"

	const totalSize = {w: 800, h: 400};
	const margin = {top: 10, right: 200, bottom: 30, left: 60};
	const width = totalSize.w - margin.left - margin.right;
	const height = totalSize.h - margin.top - margin.bottom;
	
	let selectedStates = $SelectedStatesAbbrv;
	let selectedYear = $SelectedYear;
	let selectedResource = "Total";

	const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
	let formatData = [];	//Contains each state's data as an element
	let gMin = 9999999999;		//The min and max for power generation
	let gMax = -9999999999;		

	onMount(async () => {

		//Create the main svg plot, this part has to be put within the async section
		let svg = d3.select("#chart")
			.append("svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
			.append("g")
				.attr("transform",`translate(${margin.left},${margin.top})`);

		const fetched = await fetch("static/new_data.json");
		let rawData = await fetched.json();

		let statesD = rawData.filter(record => record.YEAR == selectedYear && 
												record["ENERGY SOURCE"] == selectedResource);
		let stateList = [...new Set(statesD.map(item => item.STATE_ABBREV))];
		console.log(stateList);

		//Create the color scale
		let stateColor = [];
		let i = 0;
		let colorSample = d3.scaleSequential()
					.domain([0, 52])
					.interpolator(d3.interpolateRainbow);
		for(const state of stateList)
		{
			if(selectedStates.includes(state))
				stateColor.push(colorSample(i));
			++i;
		}
		let colorScale = d3.scaleOrdinal()
					.domain(selectedStates)
					.range(stateColor);

		//Only shows total generation here
		for(const state of selectedStates)
		{
			let stateData = rawData.filter(record => record.YEAR == selectedYear && 
									record["ENERGY SOURCE"] == selectedResource &&
									record.STATE_ABBREV == state &&
									record["TYPE OF PRODUCER"] == "Total Electric Power Industry");
			formatData.push(stateData);

			let tempMin = Math.min(...stateData.map(record => record.GENERATION));
			if(tempMin < gMin) gMin = tempMin;
			let tempMax = Math.max(...stateData.map(record => record.GENERATION));
			if(tempMax > gMax) gMax = tempMax;
		}	
		
		console.log(formatData);
		console.log(selectedStates);


		//Create X axis, use 12 months as range
		const xAxis = d3.scaleTime()
						.domain(d3.extent(months))
						.range([0, width]);
		svg.append("g")
			.attr("transform", `translate(0, ${height})`)
      		.call(d3.axisBottom(xAxis));

		//Create Y axis, use the min and max record generation as range
		const yAxis = d3.scaleLinear()
					.domain([
						0, 
						gMax
					])
					.range([ height, 0 ]);
    	svg.append("g")
      		.call(d3.axisLeft(yAxis));


		//Create line and tooltip for each state data
		let legendH = 50;
		for(const stateData of formatData)
		{
			svg.append("path")
				.datum(stateData)
				.attr("fill", "none")
				.attr("stroke", colorScale(stateData[0].STATE_ABBREV))
				.attr("stroke-width", 1.5)
				.attr("d", d3.line()
							.curve(d3.curveNatural) 	//Specific type of curve, see detail for "d3 curve"
							.x(record => xAxis(record.MONTH))
							.y(record => yAxis(record.GENERATION)));

			//Create the tooltip
			const Tooltip = d3.select("#chart")
				.append("div")
				.style("opacity", 0)
				.attr("class", "tooltip")
				.style("background-color", "white")
				.style("border", "solid")
				.style("border-width", "2px")
				.style("border-radius", "5px")
				.style("padding", "5px")

			//Three function that change the tooltip when user hover / move / leave a cell		
			//Add the points
			svg.append("g")
				.selectAll("dot")
				.data(stateData)
				.join("circle")
					.style("opacity", 0.5)
					.attr("class", "myCircle")
					.attr("cx", record => xAxis(record.MONTH))
					.attr("cy", record => yAxis(record.GENERATION))
					.attr("r", 5)
					.attr("stroke", record => colorScale(record.STATE_ABBREV))
					.attr("stroke-width", 3)
					.attr("fill", "white")
					.on("mouseover", function(event, record) {
										Tooltip
										.style("opacity", 1)

										this.style.opacity = 1;
										this.style.r = 8;
									})
					.on("mousemove", function(event, record) {
										Tooltip
										.html(record.STATE + " " + selectedYear + "/" + record.MONTH + " Generation: " + record.GENERATION)
										.style("left", `${event.layerX+10}px`)
										.style("top", `${event.layerY}px`)
									})
					.on("mouseleave", function(event, record) {
										Tooltip
										.style("opacity", 0)

										this.style.opacity = 0.5;
										this.style.r = 5;
									})
			
			//Create color legend
			svg.append("circle")
				.attr("cx",totalSize.w - 170)
				.attr("cy",legendH - 1)
				.attr("r", 6)
				.style("fill", colorScale(stateData[0].STATE_ABBREV))
			svg.append("text")
				.attr("x", totalSize.w - 150)
				.attr("y", legendH)
				.text(stateData[0].STATE)
				.style("font-size", "16px")
				.attr("alignment-baseline","middle")
			legendH += 40;
		}

	});

</script>
	

<div id="chart">	

</div>


<style>
</style>