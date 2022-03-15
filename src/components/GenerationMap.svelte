<script>
	import { onMount } from "svelte";
    import { scaleLinear } from "d3-scale"
    import { SelectedStates } from "../store.js"
    import { SelectedYear } from "../store.js"
    import { SelectedStatesAbbrv } from "../store.js"
    
	
	let data;
    let mapData;
	let view;
    let colorScale;
    let stateData = [];

    let selectedMapEnergySource = "Total"

	onMount(async () => {
		const fetched = await fetch("static/new_data.json");
		let rawData = await fetched.json();
        const mapFetched = await fetch("static/map.json");
		mapData = await mapFetched.json();

		data = rawData.filter(record => record.YEAR == $SelectedYear && 
												record["ENERGY SOURCE"] == selectedMapEnergySource &&
                                                record["TYPE OF PRODUCER"] == "Total Electric Power Industry" &&
                                                record["STATE_ABBREV"] !== "US-TOTAL");
        console.log(data);

        let stateList = [...new Set(data.map(record => {return record.STATE_ABBREV }))];
        stateList.forEach(state => {
            let thisStateGenData = data.filter(record => record.STATE_ABBREV == state);
            let sum = 0;
            thisStateGenData.forEach(month => {
                sum += month.GENERATION;
            });
            stateData.push({ abbrev: state, gen: sum });
        });

        colorScale = scaleLinear()
            .domain([Math.min(...stateData.map(state=>state.gen)), Math.max(...stateData.map(state=>state.gen))])
            .range(["#eeeeee","#4682B4"]);
	});
</script>

<div id="map">
	{#if data !== undefined}
    
    <div id="info-box"></div>
        <svg xmlns:cc="http://creativecommons.org/ns#" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="us-map" preserveAspectRatio="xMinYMin meet" sodipodi:docname="Republican_Party_presidential_primaries_results,_2016.svg" inkscape:version="0.91 r13725" x="0px" y="0px" width="959px" height="593px" viewBox="174 100 959 593" enable-background="new 174 100 959 593" xml:space="preserve">
            <sodipodi:namedview bordercolor="#666666" objecttolerance="10" pagecolor="#ffffff" borderopacity="1" gridtolerance="10" guidetolerance="10" inkscape:cx="509.19152" inkscape:cy="282.2353" inkscape:zoom="1.2137643" showgrid="false" id="namedview71" inkscape:current-layer="g5" inkscape:window-maximized="1" inkscape:window-y="-8" inkscape:window-x="-8" inkscape:pageopacity="0" inkscape:window-height="1017" inkscape:window-width="1920" inkscape:pageshadow="2"></sodipodi:namedview>
            <g id="g5">
                {#each mapData as path}
                    <path id={path.id} class={$SelectedStatesAbbrv.includes(path.id) ? "selected" : ""} d={path.d} fill={colorScale(stateData.find(state=>state.abbrev==path.id).gen)} on:click={() => {
                        if ($SelectedStatesAbbrv.includes(path.id)) {
                            let index = $SelectedStatesAbbrv.findIndex(state=>state==path.id);
                            $SelectedStatesAbbrv.splice(index, 1)
                            $SelectedStatesAbbrv = $SelectedStatesAbbrv;
                        } else {
                            $SelectedStatesAbbrv.push(path.id);
                            $SelectedStatesAbbrv = $SelectedStatesAbbrv;
                        }
                    }}/>
                {/each}
                <g id="DC">
                    <path id="path58" fill={colorScale(stateData.find(state=>state.abbrev=="DC").gen)} d="M975.8,353.8l-1.1-1.6l-1-0.8l1.1-1.6l2.2,1.5L975.8,353.8z"/>
                    <circle id="circle60" fill={colorScale(stateData.find(state=>state.abbrev=="DC").gen)} stroke="#FFFFFF" stroke-width="1.5" cx="975.3" cy="351.8" r="5"/>
                </g>
    
            </g>
            <path id="path67" fill="none" stroke="#A9A9A9" stroke-width="2" d="M385,593v55l36,45 M174,525h144l67,68h86l53,54v46"/>
        </svg>
    {/if}
</div>


<style>
	.selected
	{
		stroke: black;
        stroke-width: 3px;
	}
    path:hover, circle:hover {
        stroke: black !important;
        stroke-width:2px;
        stroke-linejoin: round;
        cursor: pointer;
}
</style>