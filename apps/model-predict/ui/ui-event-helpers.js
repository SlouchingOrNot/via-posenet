
////////////////////////////////////////////////////////////////////////
//		Handle 'smoothedPrediction' event
////////////////////////////////////////////////////////////////////////

let bestClassesHistory = []
let historyMaxLength = 50
// let historyMaxLength = 1
window.addEventListener('slouchingOrNotEvent', (domEvent) => {
	let slouchingOrNotEvent = domEvent.detail

	// keep only 'rawPrediction' event
	if (slouchingOrNotEvent.type !== 'rawPrediction') return

	// update bestClassesHistory
	bestClassesHistory.push(slouchingOrNotEvent.rawBestClass)
	while (bestClassesHistory.length > historyMaxLength) {
		bestClassesHistory.shift()
	}

	// compute smoothedBestClass
	let smoothedBestClass = 0
	for (let i = 0; i < bestClassesHistory.length; i++) {
		smoothedBestClass += bestClassesHistory[i]
	}
	smoothedBestClass /= bestClassesHistory.length
	smoothedBestClass = Math.round(smoothedBestClass)

	// update slouchingOrNotEvent
	slouchingOrNotEvent.type = 'smoothedPrediction'
	slouchingOrNotEvent.smoothedBestClass = smoothedBestClass

	// forward the event
	window.dispatchEvent(new CustomEvent("slouchingOrNotEvent", {
		detail: slouchingOrNotEvent
	}))
})

////////////////////////////////////////////////////////////////////////
//		handle smoothedBestClassChange event
////////////////////////////////////////////////////////////////////////

let lastBestClass = null
window.addEventListener('slouchingOrNotEvent', (domEvent) => {
	let slouchingOrNotEvent = domEvent.detail
	// keep only 'smoothedPrediction' event
	if (slouchingOrNotEvent.type !== 'smoothedPrediction') return

	// if smoothedBestClass is still the same, do nothing
	if (slouchingOrNotEvent.smoothedBestClass === lastBestClass) return

	// update lastBestClass
	lastBestClass = slouchingOrNotEvent.smoothedBestClass

	// update slouchingOrNotEvent
	slouchingOrNotEvent.type = 'smoothedBestClassChange'

	// forward the event
	window.dispatchEvent(new CustomEvent("slouchingOrNotEvent", {
		detail: slouchingOrNotEvent
	}))
})
