import ModelConstants from '../../../src/model-constants.js'

window.addEventListener('slouchingOrNotEvent', (domEvent) => {
	let slouchingOrNotEvent = domEvent.detail

	// keep only 'rawPrediction' event
	if (slouchingOrNotEvent.type !== 'smoothedPrediction') return

	// get data from slouchingOrNotEvent
	let isGoodEnough = slouchingOrNotEvent.isGoodEnough
	let isSeeingSomeone = slouchingOrNotEvent.isSeeingSomeone
	// let rawBestClass = slouchingOrNotEvent.rawBestClass
	let rawConfidence = slouchingOrNotEvent.rawConfidence
	let smoothedBestClass = slouchingOrNotEvent.smoothedBestClass

	// honor isGoodEnough UI
	if (isGoodEnough === true) {
		document.querySelector('#posenetResultGoodEnoughID').innerHTML = 'yes'
	} else {
		document.querySelector('#posenetResultGoodEnoughID').innerHTML = '<span style="color:red;">NO</span>'
	}

	// honor isSeeingSomeoneID
	if (isSeeingSomeone === true) {
		document.querySelector('#isSeeingSomeoneID').innerHTML = 'yes'
	} else {
		document.querySelector('#isSeeingSomeoneID').innerHTML = '<span style="color:red;">NO</span>'
	}

	// display result
	document.querySelector('#bestClassNameID').innerHTML = ModelConstants.CLASS_NAMES[smoothedBestClass]
	if (smoothedBestClass === ModelConstants.CLASS_INDEXES.isSlouching) {
		document.querySelector('#bestClassNameID').style.color = 'red'
	} else {
		document.querySelector('#bestClassNameID').style.color = ''
	}

	// display predictionConfidenceID
	document.querySelector('#predictionConfidenceID').innerHTML = `${Math.round(rawConfidence * 100)}%`

}, false)

