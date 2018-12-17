import DatasetInfo from '../../../src/dataset-info.js'
import DatasetRaw from '../../../src/dataset-raw.js';
import DatasetProcessing from '../../../src/dataset-processing.js'
import DatasetAugmentation from '../../../src/dataset-augmentation.js';
import DatasetFeature from '../../../src/dataset-feature.js'
import ModelIO from '../../../src/model-io.js';
import ModelConstants from '../../../src/model-constants.js'

let cst = ModelConstants


; (async function () {
	////////////////////////////////////////////////////////////////////////
	//		Bind Events
	////////////////////////////////////////////////////////////////////////

	window.addEventListener('slouchingOrNotEvent', (domEvent) => {
		let slouchingOrNotEvent = domEvent.detail

		// keep only 'rawPrediction' event
		if (slouchingOrNotEvent.type !== 'rawPrediction') return

		// get data from slouchingOrNotEvent
		let featureVector = slouchingOrNotEvent.featureVector

		////////////////////////////////////////////////////////////////////////
		//		Update UI
		////////////////////////////////////////////////////////////////////////

		// update isSlouchingFeatureHeatmapEl
		for (let canvasEl of [isSlouchingFeatureHeatmapEl, notSlouchingFeatureHeatmapEl]) {
			let context = canvasEl.getContext('2d')
			context.clearRect(0, 0, canvasEl.width, canvasEl.height)
			DatasetFeature.drawOneFeatureVector(context, featureVector)
		}
	})
	
	////////////////////////////////////////////////////////////////////////
	//		Handle #posenetOffsetYLabelID
	////////////////////////////////////////////////////////////////////////
	// get initial #posenetOffsetYRangeID value from localStorage if available
	if (localStorage.getItem('slouchingOrNot-predict-posenetOffsetY') !== null) {
		let value = parseFloat(localStorage.getItem('slouchingOrNot-predict-posenetOffsetY'))
		document.querySelector('#posenetOffsetYRangeID').value = value
		document.querySelector('#posenetOffsetYLabelID').innerHTML = value
	}

	// update #posenetOffsetYLabelID when #posenetOffsetYRangeID change, and update localStorage
	document.querySelector('#posenetOffsetYRangeID').addEventListener("input", function () {
		var value = document.querySelector('#posenetOffsetYRangeID').value
		// update UI
		document.querySelector('#posenetOffsetYLabelID').innerHTML = value
		// store new value in localStorage
		localStorage.setItem('slouchingOrNot-predict-posenetOffsetY', value);
	}, false);

	//////////////////////////////////////////////////////////////////////////////
	//		load dataset-info
	//////////////////////////////////////////////////////////////////////////////
	var datasetName = 'low-isSlouching__middle-notSlouching'
	if (localStorage.getItem('slouchingOrNot-predict-datasetName') !== null) {
		datasetName = localStorage.getItem('slouchingOrNot-predict-datasetName')
	}
	// set #datasetNameID value
	document.querySelector('#datasetNameID').innerHTML = datasetName

	// load datasetInfo
	var datasetInfoURL = `../../datasets/${datasetName}/dataset-info.json`
	var datasetInfo = await DatasetInfo.load(datasetInfoURL)

	//////////////////////////////////////////////////////////////////////////////
	//		load DatasetRaw
	//////////////////////////////////////////////////////////////////////////////
	console.time('loadingData')
	let datasetRaw = new DatasetRaw(cst.NUM_CLASSES)
	for (let classIndex = 0; classIndex < cst.NUM_CLASSES; classIndex++) {
		await datasetRaw.loadClass(classIndex, datasetInfo.posenetResultURLs[classIndex], datasetInfo.imageURLs[classIndex])
	}
	console.timeEnd('loadingData')
	datasetRaw.print('raw data')

	//////////////////////////////////////////////////////////////////////////////
	//		remove not isGoodEnough samples from datasetRaw
	//////////////////////////////////////////////////////////////////////////////

	datasetRaw = DatasetProcessing.removeNotGoodEnoughSamples(datasetRaw)

	//////////////////////////////////////////////////////////////////////////////
	//		balance datasetRaw
	//////////////////////////////////////////////////////////////////////////////

	DatasetProcessing.balanceDatasetRaw(datasetRaw)

	//////////////////////////////////////////////////////////////////////////////
	//		Augment datasetRaw
	//////////////////////////////////////////////////////////////////////////////

	// get current augmentationPolicy
	var augmentationPolicy = 'massiveAugmentation2'
	if (localStorage.getItem('slouchingOrNot-predict-augmentationPolicy') !== null) {
		augmentationPolicy = localStorage.getItem('slouchingOrNot-predict-augmentationPolicy')
	}

	// set #augmentationPolicyID value
	document.querySelector('#augmentationPolicyID').innerHTML = augmentationPolicy


	// augment datasetRaw
	datasetRaw = DatasetAugmentation.augmentDatasetRaw(datasetRaw, augmentationPolicy)
	datasetRaw.print('after augmentation data')

	//////////////////////////////////////////////////////////////////////////////
	//		remove any tilt in datasetRaw posenetResult keypoints
	//////////////////////////////////////////////////////////////////////////////

	datasetRaw = DatasetProcessing.removeTiltDatasetRaw(datasetRaw)

	//////////////////////////////////////////////////////////////////////////////
	//		create featureVector heatmap
	//////////////////////////////////////////////////////////////////////////////

	for (let classIndex = 0; classIndex < cst.NUM_CLASSES; classIndex++) {
		// build canvasEl
		let canvasEl = document.createElement('canvas')
		canvasEl.width = canvasEl.height = 256
		canvasEl.style.border = 'gray solid 1px'
		document.querySelector(`#featureVectorHeatmapsID .featureVectorHeatmap-${ModelConstants.CLASS_NAMES[classIndex]}`).appendChild(canvasEl)
		// build featureVectors
		let featureVectors = []
		for (let sampleIndex = 0; sampleIndex < datasetRaw.posenetResults[classIndex].length; sampleIndex++) {
			let posenetResult = datasetRaw.posenetResults[classIndex][sampleIndex]
			// if (DatasetProcessing.posenetResultGoodEnoughToLearn(posenetResult) === false) continue

			var featureVector = DatasetFeature.createFeatureVector(posenetResult)
			featureVectors.push(featureVector)
		}
		// draw heat map
		DatasetFeature.drawHeatMapCanvas(canvasEl, featureVectors)

		// draw heatmap with simpleheat.js - https://github.com/mourner/simpleheat
		// let simpleHeatmap = simpleheat(canvasEl)
		// simpleHeatmap.radius(1, 5);
		// simpleHeatmap.max(Math.log(featureVectors.length) / 3)
		// for (let vectorIndex = 0; vectorIndex < featureVectors.length; vectorIndex++) {
		// 	for (let featureIndex = 0; featureIndex < featureVectors[0].length; featureIndex++) {
		// 		var feature = featureVectors[vectorIndex][featureIndex]
		// 		simpleHeatmap.add([feature[0] * canvasEl.width, feature[1] * canvasEl.height, 1])
		// 	}
		// }
		// simpleHeatmap.draw();
	}


	// build canvas for current feature vector feedback
	let isSlouchingFeatureHeatmapEl = document.createElement('canvas')
	isSlouchingFeatureHeatmapEl.width = isSlouchingFeatureHeatmapEl.height = 256
	isSlouchingFeatureHeatmapEl.style.position = 'absolute'
	isSlouchingFeatureHeatmapEl.style.left = '0px'
	document.querySelector('#featureVectorHeatmapsID .featureVectorHeatmap-isSlouching').appendChild(isSlouchingFeatureHeatmapEl)
	let notSlouchingFeatureHeatmapEl = document.createElement('canvas')
	notSlouchingFeatureHeatmapEl.width = notSlouchingFeatureHeatmapEl.height = 256
	notSlouchingFeatureHeatmapEl.style.position = 'absolute'
	notSlouchingFeatureHeatmapEl.style.left = '0px'
	document.querySelector('#featureVectorHeatmapsID .featureVectorHeatmap-notSlouching').appendChild(notSlouchingFeatureHeatmapEl)

	window.isSlouchingFeatureHeatmapEl = isSlouchingFeatureHeatmapEl
	window.notSlouchingFeatureHeatmapEl = notSlouchingFeatureHeatmapEl

})()
