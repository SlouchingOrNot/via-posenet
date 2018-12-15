class DatasetTensor {

	/**
	 * 
	 * @param {tf.Tensor} featureVectors 
	 * @return {DatasetTensor} the datasetTensor created
	 */
	static fromFeatureVectors(featureVectors){
		var numClasses = featureVectors.length
		var datasetTensor = new DatasetTensor(numClasses)
		for(let classIndex = 0; classIndex < numClasses; classIndex++){
			const inputTensor = tf.tensor3d(featureVectors[classIndex]);

			// debugger
			let classIndexes = Array.from(new Array(featureVectors[classIndex].length), () => classIndex)
			datasetTensor.addSamples(inputTensor, classIndexes)
		}
		return datasetTensor
	}


	// export class ControllerDataset {
	constructor(numClasses) {
		this.numClasses = numClasses
		this.xs = null
		this.ys = null
	}

	clear() {
		if( this.xs )	this.xs.dispose()
		this.xs = null

		if( this.ys )	this.ys.dispose()
		this.ys = null
	}
	/**
        * Adds an example to the controller dataset.
        * @param {Tensor} example A tensor representing the example. It can be an image,
        *     an activation, or any other type of Tensor.
        * @param {number} label The label of the example. Should be a number.
        */
	addSamples(example, label) {
		// sanity check
		console.assert( example instanceof tf.Tensor === true )
		console.assert( Array.isArray(label) === true )

		// One-hot encode the label.
		const y = tf.tidy(
			() => tf.oneHot(tf.tensor1d(label).toInt(), this.numClasses)
		)

		if (this.xs == null) {
			// For the first example that gets added, keep example and y so that the
			// ControllerDataset owns the memory of the inputs. This makes sure that
			// if addSample() is called in a tf.tidy(), these Tensors will not get
			// disposed.
			this.xs = tf.keep(example)
			this.ys = tf.keep(y)
		} else {
			const oldX = this.xs
			this.xs = tf.keep(oldX.concat(example, 0))

			const oldY = this.ys
			this.ys = tf.keep(oldY.concat(y, 0))

			oldX.dispose()
			oldY.dispose()
			y.dispose()
		}
	}
}

export default DatasetTensor
