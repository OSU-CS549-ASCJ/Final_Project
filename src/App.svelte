<script>
	import GenerationMap from "./components/GenerationMap.svelte";
	import GenerationLineChart from "./components/GenerationLineChart.svelte";
	import BarChart from "./components/BarChart.svelte";
</script>

<main>
	<h1 x="50" >Visual Analytics Final Project: Team 7</h1>
	<div id="container">

		<div id="map-view" height=700>

			<div id="projection-view" height=700 class="view-panel">
				<div class="view-title">Map View</div>
				<svg height=700 width=1000>
				<foreignObject height=700 width=1000><GenerationMap height=700 width=1000/></foreignObject>
			</svg>
			</div>
			
		</div>

		<div id="sub-section" x="80" y="80">

			<div id="generation-state-view" class="view-panel">
				<div class="view-title" y="40">Generation for States</div>

				<svg width="1000" height=500>
					<foreignObject height=700 width=1000><BarChart width=1000/></foreignObject>
			</svg>

			</div>

			<div id="generation-state-resource-view" class="view-panel" height="400">

				<div class="view-title">Generation for States by Resource</div>
				<svg width="1000" height=500>
					<foreignObject height=700 width=1000><GenerationLineChart width=1000/></foreignObject>
			</svg>
			</div>

		</div>
	</div>
</main>
	
<style>
	*{
  padding: 0;
  margin: 0;
	  box-sizing: border-box;
	}
	h1 {
		font-size: 1.3rem;
		font-weight: 500;
		margin-top: 0;
	}
	#container {
		/* display: flex; */
	}
	#sidebar {
		display: flex;
		height: 400px;
 		width: 100%;
    	margin: 50px 0;
	}
	#main-section {
    	display: flex;
		/* flex-direction: row; */
		height: 400px;
    	justify-content: space-between;
 		width: 100%;
	}

	#main-section > div{
 	 width: 45%;
	}

	.view-panel {
		border: 2px solid #eee;
    width: 100%
    
	}
	.view-title {
		background-color: #f3f3f3;
		font-size: 1.0rem;
		margin-bottom: 8px;
		padding: 3px 8px 5px 12px;
	}
	#selected-image-view-content {
		height: 100px;
		padding: 15px;
	}
	svg {
		margin: 5px;
	}
	
</style>