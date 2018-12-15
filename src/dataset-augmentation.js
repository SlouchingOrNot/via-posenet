import ModelConstants from './model-constants.js'
import DatasetRaw from './dataset-raw.js'
import DatasetProcessing from './dataset-processing.js'

class DatasetAugmentation {

	////////////////////////////////////////////////////////////////////////
	//
	////////////////////////////////////////////////////////////////////////
	static augmentDatasetRaw(srcDatasetRaw, augmentationPolicy){
		var dstDatasetRaw = new DatasetRaw(srcDatasetRaw.numClasses)

		console.assert( this.registeredAugmentations[augmentationPolicy] !== undefined )
		var augmentationFunction = this.registeredAugmentations[augmentationPolicy]

		for(let classIndex = 0; classIndex < srcDatasetRaw.numClasses; classIndex++){
			for(let sampleIndex = 0; sampleIndex < srcDatasetRaw.posenetResults[classIndex].length; sampleIndex++){
				let posenetResult = srcDatasetRaw.posenetResults[classIndex][sampleIndex]

				var isGoodEnougth = DatasetProcessing.posenetResultGoodEnoughToLearn(posenetResult)
				if( isGoodEnougth === false ){
					console.log(`Not augmenting rawData as not GoodEnough ${ModelConstants.CLASS_NAMES[classIndex]}/${sampleIndex}`)
					continue
				}

				// var augmentedResults = augmentationFunction(classIndex, posenetResult)
				var augmentedResults = augmentationFunction(srcDatasetRaw.posenetResults, classIndex, sampleIndex)

				var imageURL = srcDatasetRaw.imageURLs[classIndex][sampleIndex]
				for(let augmentedResult of augmentedResults){
					dstDatasetRaw.posenetResults[classIndex].push(augmentedResult)
					dstDatasetRaw.imageURLs[classIndex].push(imageURL)
				}
			}
		}

		return dstDatasetRaw
	}


	////////////////////////////////////////////////////////////////////////
	//	to register augmentationFunction for a augmentationPolicy
	////////////////////////////////////////////////////////////////////////

	/**
	 * register a augmentation policy function
	 * 
	 * @param {String} augmentationPolicy augmentation policy name under which this augmentation function is registered
	 * @param {Function} augmentationFunction the function which augment the data
	 */
	static register(augmentationPolicy, augmentationFunction){
		console.assert( DatasetAugmentation.registeredAugmentations[augmentationPolicy] === undefined )
		DatasetAugmentation.registeredAugmentations[augmentationPolicy] = augmentationFunction
	}

	////////////////////////////////////////////////////////////////////////
	//	Custom random functions
	////////////////////////////////////////////////////////////////////////

	// better random function https://gist.github.com/bluesmoon/7925696
	// - you can definitly do better on random
	// - nice tutorial https://www.alanzucconi.com/2015/09/16/how-to-sample-from-a-gaussian-distribution/

	/**
	 * Random function between Normal Distribution Between 0 and 1
	 * - from https://stackoverflow.com/questions/25582882/javascript-math-random-normal-distribution-gaussian-bell-curve
	 */
	static _randomBoxMuller() {
	    var u = 0, v = 0;
	    while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
	    while(v === 0) v = Math.random();
	    let num = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
	    num = num / 10.0 + 0.5; // Translate to 0 -> 1
	    if (num > 1 || num < 0) return DatasetAugmentation._randomBoxMuller(); // resample between 0 and 1
	    return num;
	}

}

/**
 * Store the registered augmentationPolicy
 */
DatasetAugmentation.registeredAugmentations = {}

export default DatasetAugmentation

////////////////////////////////////////////////////////////////////////
//	register various augmentation policy
////////////////////////////////////////////////////////////////////////

/**
 * define augmentation policy 'noAugmentation'
 */
DatasetAugmentation.register('noAugmentation', (posenetResults, classIndex, sampleIndex) => {
	let posenetResult = posenetResults[classIndex][sampleIndex]
	var augmentedPosenetResults = []

	// no augmentation at all - we keep only the original data
	augmentedPosenetResults.push(posenetResult)
	return augmentedPosenetResults
})

/**
 * define augmentation policy 'massiveAugmentation'
 */
DatasetAugmentation.register('massiveAugmentation', (posenetResults, classIndex, sampleIndex) => {
	var randomFct = Math.random
	// var randomFct = DatasetAugmentation._randomBoxMuller
	let posenetResult = posenetResults[classIndex][sampleIndex]
	var augmentedPosenetResults = []

	// we keep the original data
	augmentedPosenetResults.push(posenetResult)

	for(let i = 0; i < 20; i++){
		// translateKeypointPositions
		let clonedResult = DatasetProcessing.clonePosenetResult(posenetResult)
		DatasetProcessing.randomizeKeypointPositions(clonedResult, randomFct, -5, +5, -5, +5)
		// DatasetProcessing.translateKeypointPositions(clonedResult, randomFct, -5, +5, -25, +25)
		DatasetProcessing.scaleKeypointPositions(clonedResult, randomFct, 1-0.1, 1+0.1, 1-0.1, 1+0.1)
		augmentedPosenetResults.push(clonedResult)
	}

	return augmentedPosenetResults
})

/**
 * define augmentation policy 'massiveAugmentation2'
 */
DatasetAugmentation.register('massiveAugmentation2', (posenetResults, classIndex, sampleIndex) => {
	let posenetResult = posenetResults[classIndex][sampleIndex]
	var augmentedPosenetResults = []

	// we keep the original data
	augmentedPosenetResults.push(posenetResult)

	for(let i = 0; i < 100; i++){
		var randomFct = Math.random
		// var randomFct = DatasetAugmentation._randomBoxMuller

		// apply augmentation
		let clonedResult = DatasetProcessing.clonePosenetResult(posenetResult)
		DatasetProcessing.randomizeKeypointPositions(clonedResult, randomFct, -3, +3, -3, +3)
		// DatasetProcessing.translateKeypointPositions(clonedResult, randomFct, -50, +50, -50, +50)
		// DatasetProcessing.scaleKeypointPositions(clonedResult, randomFct, 1-0.1, 1+0.1, 1-0.1, 1+0.1)

		// add it to augmentedPosenetResults
		augmentedPosenetResults.push(clonedResult)
	}

	// apply linear interpolication between class
	let otherClassIndex = classIndex === ModelConstants.CLASS_INDEXES.isSlouching ? ModelConstants.CLASS_INDEXES.notSlouching : ModelConstants.CLASS_INDEXES.isSlouching
	for(let i = 0; i < 100; i++){
		// get randomFct
		var randomFct = Math.random
		// var randomFct = DatasetAugmentation._randomBoxMuller

		// pick otherPosenetResult in the otherClass
		let otherSampleIndex = Math.floor(posenetResults[otherClassIndex].length * Math.random())
		let otherPosenetResult = posenetResults[otherClassIndex][otherSampleIndex]
		// apply augmentation
		let clonedResult = DatasetProcessing.clonePosenetResult(posenetResult)
		DatasetProcessing.linearInterpolationKeypoint(clonedResult, otherPosenetResult, randomFct, 0.55)
		// add it to augmentedPosenetResults
		augmentedPosenetResults.push(clonedResult)
	}

	return augmentedPosenetResults
})
