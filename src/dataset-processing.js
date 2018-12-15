import ModelConstants from './model-constants.js'
import DatasetRaw from './dataset-raw.js'

class DatasetProcessing {

	/**
	 * balance the classes of a DatasetRaw. It is important as unbalanced classes
	 * are known to be an issue when doing a classification problem.
	 * see this link for more infortmations https://towardsdatascience.com/dealing-with-imbalanced-classes-in-machine-learning-d43d6fa19d2
	 * https://twitter.com/jerome_etienne/status/1066759290688540673
	 *
	 * @param {datasetRaw} datasetRaw the dataset to balance
	 */
	static balanceDatasetRaw(datasetRaw){
		// count the amount of samples for the most represented class
		var maxSamplesPerClass = 0
		for(var classIndex = 0; classIndex < datasetRaw.numClasses; classIndex++){
			var samplesCount = datasetRaw.posenetResults[classIndex].length
			if( samplesCount > maxSamplesPerClass ){
				maxSamplesPerClass = samplesCount
			}
		}

		// add as many _clonePosenetResult as needed until each class got maxSamplesPerClass
		for(let classIndex = 0; classIndex < datasetRaw.numClasses; classIndex++){
			// how many sample is there currently in this class
			var samplesCount = datasetRaw.posenetResults[classIndex].length
			// add as many _clonePosenetResult as needed until each class got maxSamplesPerClass
			for(let sampleIndex = samplesCount; sampleIndex < maxSamplesPerClass; sampleIndex++){
				// pick a sample at random in this class
				let originalSampleIndex = Math.floor(datasetRaw.posenetResults[classIndex].length * Math.random())
				let originalPosenetResult = datasetRaw.posenetResults[classIndex][originalSampleIndex]
				// clone it
				let posenetResult = DatasetProcessing.clonePosenetResult(originalPosenetResult)
				// add it to this datasetRaw
				datasetRaw.posenetResults[classIndex].push(posenetResult)
				// add the matching imageURL
				var imageURL = datasetRaw.imageURLs[classIndex][originalSampleIndex]
				datasetRaw.imageURLs[classIndex].push(imageURL)
			}
		}
		return datasetRaw
	}

	////////////////////////////////////////////////////////////////////////
	//	removeNotGoodEnoughSamples
	////////////////////////////////////////////////////////////////////////

	static removeNotGoodEnoughSamples(srcDatasetRaw){
		var dstDatasetRaw = new DatasetRaw(srcDatasetRaw.numClasses)

		for(let classIndex = 0; classIndex < srcDatasetRaw.numClasses; classIndex++){
			// add as many _clonePosenetResult as needed until each class got maxSamplesPerClass
			for(let sampleIndex = 0; sampleIndex < srcDatasetRaw.posenetResults[classIndex].length; sampleIndex++){
				let posenetResult = srcDatasetRaw.posenetResults[classIndex][sampleIndex]

				// if posenetResult isGoodEnough, dont touch it
				let isGoodEnough = DatasetProcessing.posenetResultGoodEnoughToLearn(posenetResult)
				if( isGoodEnough === false ){
					console.log(`Removing posenetResult as not GoodEnough ${ModelConstants.CLASS_NAMES[classIndex]}/${sampleIndex}`)
					continue
				}

				// remove the sampleIndex element from srcDatasetRaw arrays
				dstDatasetRaw.posenetResults[classIndex].push(posenetResult)
				var imageURL = srcDatasetRaw.imageURLs[classIndex][sampleIndex]
				dstDatasetRaw.imageURLs[classIndex].push(imageURL)
			}
		}
		return dstDatasetRaw
	}
	////////////////////////////////////////////////////////////////////////
	//	removeTiltDatasetRaw
	////////////////////////////////////////////////////////////////////////

	static removeTiltDatasetRaw(srcDatasetRaw){
		var dstDatasetRaw = new DatasetRaw(srcDatasetRaw.numClasses)
		for(let classIndex = 0; classIndex < srcDatasetRaw.numClasses; classIndex++){
			// add as many _clonePosenetResult as needed until each class got maxSamplesPerClass
			for(let sampleIndex = 0; sampleIndex < srcDatasetRaw.posenetResults[classIndex].length; sampleIndex++){
				let posenetResult = srcDatasetRaw.posenetResults[classIndex][sampleIndex]

				// remove the tilt on this posenetResult
				DatasetProcessing.removeTiltPosenetResult(posenetResult)

				// remove the sampleIndex element from srcDatasetRaw arrays
				dstDatasetRaw.posenetResults[classIndex].push(posenetResult)
				var imageURL = srcDatasetRaw.imageURLs[classIndex][sampleIndex]
				dstDatasetRaw.imageURLs[classIndex].push(imageURL)
			}
		}
		return dstDatasetRaw
	}

	/**
	 * average the Y between both eyes, ears, shoulders etc...
	 * reduce the influence of tilt of the eyes, ears, shoulders.... which are irrlevant to the slounchingOrNot problem.
	 * additionally reduce the noise in the original posenet predictions.
	 */
	static removeTiltPosenetResult(posenetResult){
		var keypointCouples = [
			['leftEye', 'rightEye'],
			['leftEar', 'rightEar'],
			['leftShoulder', 'rightShoulder'],
			['leftElbow', 'rightElbow'],
			['leftWrist', 'rightWrist'],
			['leftHip', 'rightHip'],
			['leftKnee', 'rightKnee'],
			['leftAnkle', 'rightAnkle'],
		]
		for(let [leftKeypointName, rightKeypointName] of keypointCouples){
			let leftKeypoint = posenetResult[0].keypoints[ ModelConstants.KeypointIndexes[leftKeypointName] ]
			let rightKeypoint = posenetResult[0].keypoints[ ModelConstants.KeypointIndexes[rightKeypointName] ]

			var centerY = ( leftKeypoint.position.y + rightKeypoint.position.y ) / 2

			leftKeypoint.position.y = centerY
			rightKeypoint.position.y = centerY
		}
	}
	////////////////////////////////////////////////////////////////////////
	//
	////////////////////////////////////////////////////////////////////////

	/**
	 * close a posenetResult
	 */
	static clonePosenetResult(posenetResult){
		var newResult = [{
			score: posenetResult[0].score,
			keypoints: [],
		}]
		for(let keypoint of posenetResult[0].keypoints){
			newResult[0].keypoints.push({
				part: keypoint.part,
				position: {
					x : keypoint.position.x,
					y : keypoint.position.y,
				},
				score: keypoint.score,
			})
		}
		return newResult
	}
	/**
	 * compute a lerp between 2 posenetResult
	 */
	static lerpPosenetResult(posenetResultDest, posenetResultA, posenetResultB, lerpRatio){
		posenetResultDest[0].score = posenetResultA[0].score * lerpRatio + posenetResultB[0].score * (1 - lerpRatio)
		for(let i = 0; i < posenetResultDest[0].keypoints.length; i++){
			var keypointDest = posenetResultDest[0].keypoints[i]
			var keypointA = posenetResultA[0].keypoints[i]
			var keypointB = posenetResultB[0].keypoints[i]

			keypointDest.position.x = keypointA.position.x * lerpRatio + keypointB.position.x * (1 - lerpRatio)
			keypointDest.position.y = keypointA.position.y * lerpRatio + keypointB.position.y * (1 - lerpRatio)
			keypointDest.score = keypointA.score * lerpRatio + keypointB.score * (1 - lerpRatio)
		}
	}

	////////////////////////////////////////////////////////////////////////
	//	various operation on posenetResult
	////////////////////////////////////////////////////////////////////////

	/**
	 * randomize each keypoint individiually in a [minX,maxX] range and [minY, maxY]
	 * 
	 * @param {Array} posenetResult posenetResult to process
	 * @param {Function} randomFct random function to use
	 * @param {Number} minX minimal x
	 * @param {Number} maxX maximal x
	 * @param {Number} minY minimal y
	 * @param {Number} maxY maximal y
	 */
	static randomizeKeypointPositions(posenetResult, randomFct, minX, maxX, minY, maxY){
		for(let {position} of posenetResult[0].keypoints){
			position.x += minX + randomFct()*(maxX - minX)
			position.y += minY + randomFct()*(maxY - minY)

			// clamp it between 0 and ModelConstants.POSENET_WIDTH
			position.x = Math.min(Math.max(position.x, 0), ModelConstants.POSENET_WIDTH)
			position.y = Math.min(Math.max(position.y, 0), ModelConstants.POSENET_WIDTH)
		}
	}
	static scaleKeypointPositions(posenetResult, randomFct, minX, maxX, minY, maxY){
		let scaleX = minX + randomFct()*(maxX - minX)
		let scaleY = minX + randomFct()*(maxX - minX)
		// let faceCenterKeypoint = posenetResult[0].keypoints[ModelConstants.KeypointIndexes['nose']]
		let faceCenterKeypoint = DatasetProcessing.createFaceCenterKeypoint(posenetResult)

		for(let {position} of posenetResult[0].keypoints){
			let positionX = position.x - faceCenterKeypoint.position.x
			let positionY = position.y - faceCenterKeypoint.position.y

			positionX *= scaleX
			positionY *= scaleY

			position.x = positionX + faceCenterKeypoint.position.x
			position.y = positionY + faceCenterKeypoint.position.y

			// clamp it between 0 and ModelConstants.POSENET_WIDTH
			position.x = Math.min(Math.max(position.x, 0), ModelConstants.POSENET_WIDTH)
			position.y = Math.min(Math.max(position.y, 0), ModelConstants.POSENET_WIDTH)
		}
	}

	static translateKeypointPositions(posenetResult, randomFct, minX, maxX, minY, maxY){
		let deltaX = minX + randomFct()*(maxX - minX)
		let deltaY = minY + randomFct()*(maxY - minY)
		for(let {position} of posenetResult[0].keypoints){
			position.x += deltaX
			position.y += deltaY

			// clamp it between 0 and ModelConstants.POSENET_WIDTH
			position.x = Math.min(Math.max(position.x, 0), ModelConstants.POSENET_WIDTH)
			position.y = Math.min(Math.max(position.y, 0), ModelConstants.POSENET_WIDTH)
		}
	}

	
	static translateFixKeypointPositions(posenetResult, deltaX, deltaY){
		for(let {position} of posenetResult[0].keypoints){
			position.x += deltaX
			position.y += deltaY

			// clamp it between 0 and ModelConstants.POSENET_WIDTH
			position.x = Math.min(Math.max(position.x, 0), ModelConstants.POSENET_WIDTH)
			position.y = Math.min(Math.max(position.y, 0), ModelConstants.POSENET_WIDTH)
		}
	}
	static linearInterpolationKeypoint(posenetResult, otherPosenetResult, randomFct, ratio){
		for(let i = 0; i < posenetResult[0].keypoints.length; i++){
			var position = posenetResult[0].keypoints[i].position
			var otherPosition = otherPosenetResult[0].keypoints[i].position

			position.x = position.x + ratio*randomFct()*(otherPosition.x - position.x)
			position.y = position.y + ratio*randomFct()*(otherPosition.y - position.y)
		}
	}


	////////////////////////////////////////////////////////////////////////
	//	Create 'virtual' keypoints
	////////////////////////////////////////////////////////////////////////

	/**
	 * Create a virtual keypoints (as in posenetResult keypoint) of the center
	 * of the face. It is an everage of each keypoint composing the face
	 */
	static createFaceCenterKeypoint(posenetResult){
		// create a fake keypoint for faceCenter
		var keypoint = {
			part: 'faceCenter',
			score: 0,
			position : { x : 0, y : 0, }
		}
		// list of keypointIndexes which are part of the faceCenter computation
		const keypointIndexes = [
			ModelConstants.KeypointIndexes['nose'],
			ModelConstants.KeypointIndexes['leftEye'],
			ModelConstants.KeypointIndexes['rightEye'],
			ModelConstants.KeypointIndexes['leftEar'],
			ModelConstants.KeypointIndexes['rightEar'],
		]
		// compute the average between all keypointIndexes
		for(let i = 0; i < keypointIndexes.length; i++){
			var baseKeypoint = posenetResult[0].keypoints[keypointIndexes[i]]
			keypoint.position.x += baseKeypoint.position.x
			keypoint.position.y += baseKeypoint.position.y
			keypoint.score += baseKeypoint.score
		}
		keypoint.position.x /= keypointIndexes.length
		keypoint.position.y /= keypointIndexes.length
		keypoint.score /= keypointIndexes.length

		// return the just built keypoint
		return keypoint
	}

	////////////////////////////////////////////////////////////////////////
	//	Quality estimator for posenetResult
	////////////////////////////////////////////////////////////////////////

	/**
	 * Determine if a posenetResult is considered good enougth for being learned
	 */
	static posenetResultGoodEnoughToLearn(posenetResult){
			// keep only a part of the keypoints
		let keypointIndexes = ModelConstants.featureVectorKeypointIndexes
		for(let keypointIndex = 0; keypointIndex < keypointIndexes.length; keypointIndex++){
			let keypoint = posenetResult[0].keypoints[keypointIndex]
			// reject if any feature keypoint got a score below 0.5
			if( keypoint.score < 0.65 )	return false
		}
		return true
	}


	/**
	 * Determine if a posenetResult contains a actual pose
	 */
	static posenetResultIsSeeingSomeone(posenetResult){
		let averageScore = 0;
		// keep only a part of the keypoints
		let keypointIndexes = ModelConstants.featureVectorKeypointIndexes
		for(let keypointIndex = 0; keypointIndex < keypointIndexes.length; keypointIndex++){
			let keypoint = posenetResult[0].keypoints[keypointIndex]
			averageScore += keypoint.score
		}
		// divide by the number of keypoints
		averageScore /= keypointIndexes.length
		// apply threshold on averageScore
		let isSeeingSomeone = averageScore >= 0.4 ? true : false
		// return the result as true/false
		return isSeeingSomeone
	}

}

/**
 * export the default for this module
 */
export default DatasetProcessing
