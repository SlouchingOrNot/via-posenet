/**
 * Standalone class to handle IO for tensorflow models
 */
class ModelIO {
	constructor(modelURL){
		this.modelURL = modelURL
	}
	async save(model){
		const saveResult = await model.save(this.modelURL)
	}
	async load(){
		var model = await tf.loadModel(this.modelURL)
		return model
	}
	async delete(){
		const result = await tf.io.removeModel(this.modelURL)
	}
	async exists(){
		var listModels = await tf.io.listModels()
		var result = Object.keys(listModels).indexOf(this.modelURL)
		var found = result !== -1 ? true : false
		return found
	}
}

export default ModelIO
