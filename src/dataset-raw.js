import ModelConstants from './model-constants.js'

class DatasetRaw {

	constructor(numClasses){
		this.numClasses = numClasses
		this.posenetResults = Array.from(new Array(numClasses), () => [])
		this.imageURLs = Array.from(new Array(numClasses), () => [])
	}

	print(title){
		console.log('=================================================== DatasetRaw: '+title)
		for(let classIndex = 0; classIndex < this.numClasses; classIndex++){
			console.log(`class ${classIndex}: ${this.posenetResults[classIndex].length} samples`)
		}
	}

	createHTMLSummary(title){

		var htmlContent = '<div>'
		htmlContent += `<h4>Dataset Raw ${title}</h4>`
		for(let classIndex = 0; classIndex < this.numClasses; classIndex++){
			htmlContent += `<div>
				class ${ModelConstants.CLASS_NAMES[classIndex]}: ${this.posenetResults[classIndex].length} samples
			</div>`
		}
		htmlContent += '</div>'

		// convert htmlContent string into domElement
		var tmpElement = document.createElement('div');
		tmpElement.innerHTML = htmlContent.trim()
		var domElement = tmpElement.firstChild

		// return domElement
		return domElement
	}

	async loadClass(classIndex, posenetResultURLs, imageURLs){
		console.assert(classIndex < this.numClasses)
		// debugger
		this.posenetResults[classIndex] = await DatasetRaw._loadResults(posenetResultURLs)

		// sanity check
		console.assert(posenetResultURLs.length === imageURLs.length )
		// copy imageURLs
		this.imageURLs[classIndex] = imageURLs.slice(0)
	}

	//////////////////////////////////////////////////////////////////////////////
	//		Code Separator
	//////////////////////////////////////////////////////////////////////////////

	static async _loadResults(posenetResultURLs){
		let promises = []
		for(let i = 0; i < posenetResultURLs.length; i++){
			let promise = DatasetRaw._loadResult(posenetResultURLs[i])
			promises.push(promise)
		}
		return Promise.all(promises)
	}
	/**
	 * load a json file
	 *
	 * @param {string} url the url of the file to load
	 * @return {Promise<Object>} promise called when request is completed and resolve with the parsed json object
	 */
	static async _loadResult(url){
		let isNode = typeof window === 'undefined' ? true : false
		if( isNode === false ){
			// TODO why not fetch ?
			return new Promise(async (resolve, reject) => {
				let request = new XMLHttpRequest();
				request.addEventListener("load", function() {
					resolve(JSON.parse(this.responseText));
				});
				request.addEventListener("error", function(event) {
					reject(event)
				});
				request.addEventListener("timeout", function(progressEvent) {
					reject(progressEvent)
				});
				request.open("GET", url);
				request.send();
			})
		}else{
			// return new Promise(async (resolve, reject) => {
			// 	let fs = await import('fs')	// import node.js module
			// 	fs.readFile(url, 'utf8', function(err, contents) {
			// 		resolve(JSON.parse(contents));
			// 	});
			// })

		}
	}
}

export default DatasetRaw
