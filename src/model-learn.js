import ModelConstants from './model-constants.js'

class Model {

	static async train(tfModel, datasetTensor){
		// const optimizer = 'rmsprop';
		// Creates the optimizers which drives training of the model.
		const optimizer = tf.train.adam(0.005)

		const trainEpochs = 50
		// const trainEpochs = 5

		tfModel.compile({
			optimizer,
			loss: 'categoricalCrossentropy',
			// loss: 'binaryCrossentropy',
			metrics: ['accuracy'],
		});

		// const batchSize = 1;
		let batchSize = Math.floor(datasetTensor.xs.shape[0] * 0.1)
		batchSize = Math.max(batchSize, 4)
		batchSize = Math.min(batchSize, 64)

		console.log('batchSize', batchSize)

		// const validationSplit = 0.15
		const validationSplit = 0.3

		// trying to use tfjs-vis
		const metrics = ['loss', 'val_loss', 'acc', 'val_acc'];
		const container = { name: 'model.fit metrics', tab: 'Training' };
		const fitCallbacks = tfvis.show.fitCallbacks(container, metrics);
		const tfjsApplyWorkaroundCanvasSize = () => {
			// Working around a bug in tfvis - it keeps increasing the size of the canvas for no reason
			// - so here imforcing them back
			Array.from(document.querySelectorAll('.vega-embed canvas')).forEach( (canvasEl) => {
				canvasEl.style.height = '200px'
			})
		}

		var currentEpoch = 0
		await tfModel.fit(datasetTensor.xs, datasetTensor.ys, {
			batchSize,
			validationSplit,
			epochs: trainEpochs,
			shuffle: true,	// isnt that the default?
			// callbacks: fitCallbacks,
			callbacks: {
				onBatchEnd: async (batch, logs) => {
					// console.log(`batch ${batch}`)
					// fitCallbacks.onBatchEnd.apply(this, [batch, logs])
					// tfjsApplyWorkaroundCanvasSize()

					// console.log('on onBatchEnd', logs.loss, logs.acc)
					// await tf.nextFrame();
				},
				onEpochEnd: async (epoch, logs) => {
					fitCallbacks.onEpochEnd.apply(this, [epoch, logs])
					tfjsApplyWorkaroundCanvasSize()

					currentEpoch++
					// console.log(`====================== on onEpochEnd ${currentEpoch}/${trainEpochs} loss=${logs.loss} val_acc=${logs.val_acc}`)
					// await tf.nextFrame();
				}
			}
		});
	}

}

export default Model
