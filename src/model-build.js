import ModelConstants from './model-constants.js'

class ModelBuild {

	// good links
	// - https://js.tensorflow.org/tutorials/webcam-transfer-learning.html

	static create(inputShape){
		// inspired from https://github.com/tensorflow/tfjs-examples/blob/master/mnist/index.js#L99
		const model = tf.sequential();
		model.add(tf.layers.flatten({inputShape: inputShape}));
		// model.add(tf.layers.dense({units: 100, activation: 'relu'}));
		// model.add(tf.layers.dense({units: 50, activation: 'relu'}));


		// model.add(tf.layers.dense({units: 20, activation: 'relu'}));
		// model.add(tf.layers.dropout({rate:0.3}));
		// model.add(tf.layers.dense({units: 10, activation: 'relu'}));
		// model.add(tf.layers.dropout({rate:0.3}));
		// model.add(tf.layers.dense({units: 100, activation: 'relu'}));
		// model.add(tf.layers.dropout({rate:0.1}));
		// model.add(tf.layers.dense({units: 50, activation: 'relu'}));

		// model.add(tf.layers.dense({units: 100, activation: 'relu'}));
		// model.add(tf.layers.dense({units: 100, activation: 'relu'}));
		// model.add(tf.layers.dropout({rate:0.1}));
		// model.add(tf.layers.dense({units: 100, activation: 'relu'}));
		// model.add(tf.layers.dropout({rate:0.1}));
		// model.add(tf.layers.dense({units: 50, activation: 'relu'}));

		// model.add(tf.layers.dense({units: 50, activation: 'relu'}));
		// model.add(tf.layers.dense({units: 50, activation: 'relu'}));

		// model.add(tf.layers.dense({units: 30, activation: 'relu'}));
		// model.add(tf.layers.dense({units: 20, activation: 'relu'}));

		model.add(tf.layers.dense({
			units: 28,
			activation: 'relu',
			kernelInitializer: 'varianceScaling',
			// useBias: true,
		}));
		model.add(tf.layers.dropout({rate:0.1}));
		model.add(tf.layers.dense({
			units: 10,
			activation: 'relu',
			kernelInitializer: 'varianceScaling',
		        // useBias: false
		}));
		model.add(tf.layers.dropout({rate:0.1}));

		model.add(tf.layers.dense({units: 2, activation: 'softmax'}));
		return model
	}

}

export default ModelBuild
