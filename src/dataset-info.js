class DatasetInfo {
	static async load(datasetInfoURL){
		const response = await fetch(datasetInfoURL)
		const datasetInfo = await response.json();

		let datasetRootURL = datasetInfoURL.substring(0, datasetInfoURL.lastIndexOf("/")+1);

		for(let classIndex = 0; classIndex < datasetInfo.imageURLs.length; classIndex++){
			for(let sampleIndex = 0; sampleIndex < datasetInfo.imageURLs[classIndex].length; sampleIndex++){
				datasetInfo.imageURLs[classIndex][sampleIndex] = datasetRootURL + datasetInfo.imageURLs[classIndex][sampleIndex]
				datasetInfo.posenetResultURLs[classIndex][sampleIndex] = datasetRootURL + datasetInfo.posenetResultURLs[classIndex][sampleIndex]
			}
		}
		
		return datasetInfo;	
	}
}


export default DatasetInfo
