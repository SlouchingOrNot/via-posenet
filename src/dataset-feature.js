import ModelConstants from './model-constants.js'
import DatasetProcessing from './dataset-processing.js'

class DatasetFeature {

	/**
	 * Create a DatasetFeature from a DatasetRaw
	 * @param {DatasetRaw} datasetRaw datasetRaw to import
	 */
	static fromDatasetRaw(datasetRaw){
		var featureVectors = Array.from(new Array(datasetRaw.numClasses), () => [])
		for(let classIndex = 0; classIndex < datasetRaw.numClasses; classIndex++){
			for(let sampleIndex = 0; sampleIndex < datasetRaw.posenetResults[classIndex].length; sampleIndex++){
				let posenetResult = datasetRaw.posenetResults[classIndex][sampleIndex]

				// check it is good enougth
				var isGoodEnougth = DatasetProcessing.posenetResultGoodEnoughToLearn(posenetResult)
				if( isGoodEnougth !== true ){
					console.log(`Not creating a feature vector from posenetResult as not good enougth - ${sampleIndex+1}th sample of class ${classIndex}`)
					continue
				}

				// add this feature vector in datasetTensort
				let featureVector = DatasetFeature.createFeatureVector(posenetResult)
				featureVectors[classIndex].push(featureVector)
			}
		}
		return featureVectors
	}

	////////////////////////////////////////////////////////////////////////
	//	
	////////////////////////////////////////////////////////////////////////
	

	/**
	 * Create a feature vector from a posenetResult
	 */
	static createFeatureVector(posenetResult){
		// let faceCenterKeypoint = posenetResult[0].keypoints[ModelConstants.KeypointIndexes['nose']]
		let faceCenterKeypoint = DatasetProcessing.createFaceCenterKeypoint(posenetResult)
		let featureVector = []

		ModelConstants.featureVectorKeypointIndexes.forEach((keypointIndex) => {
			let keypoint = posenetResult[0].keypoints[keypointIndex]
			var positionX = keypoint.position.x
			var positionY = keypoint.position.y

			// sanity check
			console.assert( (positionX >= 0 && positionX <= ModelConstants.POSENET_WIDTH)
				&&
				(positionY >= 0 && positionY <= ModelConstants.POSENET_WIDTH), `invalid keypoint position (${positionX}, ${positionY})`)

			// make all positions related to nose position
			positionX = positionX - faceCenterKeypoint.position.x + ModelConstants.POSENET_WIDTH/2
			// positionY = positionY - faceCenterKeypoint.position.y + ModelConstants.POSENET_WIDTH/2

			// clamp it between 0 and ModelConstants.POSENET_WIDTH
			positionX = Math.min(Math.max(positionX, 0), ModelConstants.POSENET_WIDTH)
			positionY = Math.min(Math.max(positionY, 0), ModelConstants.POSENET_WIDTH)

			// keep positionX/positionY between [0 and +1]
			positionX = positionX / ModelConstants.POSENET_WIDTH
			positionY = positionY / ModelConstants.POSENET_WIDTH

			// sanity check
			console.assert( (positionX >= 0 && positionX <= 1.0) && (positionY >= 0 && positionY <= 1.0), `invalid keypoint position (${positionX}, ${positionY})`)


			// add those coordinates as featureVector
			featureVector.push([positionX, positionY])
		})

		return featureVector
	}

	////////////////////////////////////////////////////////////////////////
	//	Drawing Feature Vectors
	////////////////////////////////////////////////////////////////////////
	

	static drawOneFeatureVector(context, featureVector){
		for(let vector of featureVector){
			context.beginPath();
			context.arc(vector[0] * context.canvas.width, vector[1] * context.canvas.height, 3, 0, 2 * Math.PI);
			context.fill();
		}
	}

	static drawHeatMapCanvas(canvasEl, featureVectors){
		var context = canvasEl.getContext('2d')

		// compute color intensity based on featureVectors.length
		var colorIntensity = Math.floor(64 * 255/featureVectors.length)

		// fill canvasEl background
		context.fillStyle = 'rgb(10,50,50)';
		context.fillRect(0, 0, canvasEl.width, canvasEl.height);
		// set style for feature
		context.fillStyle = `rgba(${colorIntensity},0,0, 1.0)`;
		context.globalCompositeOperation = 'lighter';
		// draw each feature
		for(let featureVector of featureVectors){
			DatasetFeature.drawOneFeatureVector(context, featureVector)
		}

		return canvasEl
	}
}

export default DatasetFeature
