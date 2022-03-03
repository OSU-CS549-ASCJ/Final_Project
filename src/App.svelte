<script>
	import StockLineChart from "./components/StockLineChart.svelte"
	import PopulationMap from "./components/PopulationMap.svelte"	
</script>

<main>
	<h1 x="50" >Visual Analytics Final Project: Team 7</h1>
	<div id="container">
		<div id="sidebar">
			<div id="projection-view" class="view-panel">
				<div class="view-title">Projection View</div>
				<svg class="imagedot">
					
				</svg>
			</div>
			
		</div>

		<div id="main-section" x="80" y="80">
			<div id="selected-image-view" class="view-panel">
				<div class="view-title" y="40">Selected Image</div>
				<div id="selected-image-view-content" >
					<svg ></svg>
				</div>
			</div>
			<div id="score-distributions-view" class="view-panel">
				<div class="view-title">Score Distributions</div>
				
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