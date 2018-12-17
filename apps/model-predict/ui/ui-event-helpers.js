

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

	// do a shallow copy of slouchingOrNotEvent
	slouchingOrNotEvent = Object.assign({}, slouchingOrNotEvent);

	// update slouchingOrNotEvent
	slouchingOrNotEvent.type = 'smoothedPrediction'
	slouchingOrNotEvent.smoothedBestClass = smoothedBestClass

	// forward the event
	window.dispatchEvent(new CustomEvent("slouchingOrNotEvent", {
		detail: slouchingOrNotEvent
	}))
})

////////////////////////////////////////////////////////////////////////
//		Handle #smoothedBestClassWidthLabelID
////////////////////////////////////////////////////////////////////////
// get initial #smoothedBestClassWidthRangeID value from localStorage if available
if (localStorage.getItem('slouchingOrNot-predict-smoothedBestClassWidth') !== null) {
	let value = parseFloat(localStorage.getItem('slouchingOrNot-predict-smoothedBestClassWidth'))
	document.querySelector('#smoothedBestClassWidthRangeID').value = value
	document.querySelector('#smoothedBestClassWidthLabelID').innerHTML = value
	// update historyMaxLength
	historyMaxLength = value
}

// update #smoothedBestClassWidthLabelID when #smoothedBestClassWidthRangeID change, and update localStorage
document.querySelector('#smoothedBestClassWidthRangeID').addEventListener("input", function () {
	var value = parseFloat(document.querySelector('#smoothedBestClassWidthRangeID').value)
	// update UI
	document.querySelector('#smoothedBestClassWidthLabelID').innerHTML = value
	// store new value in localStorage
	localStorage.setItem('slouchingOrNot-predict-smoothedBestClassWidth', value);
	// update historyMaxLength
	historyMaxLength = value
}, false);

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

	// log to debug
	// console.log(`sending a smoothedBestClassChange. from ${lastBestClass} to ${slouchingOrNotEvent.smoothedBestClass}`)

	// update lastBestClass
	lastBestClass = slouchingOrNotEvent.smoothedBestClass

	// do a shallow copy of slouchingOrNotEvent
	slouchingOrNotEvent = Object.assign({}, slouchingOrNotEvent);

	// update slouchingOrNotEvent
	slouchingOrNotEvent.type = 'smoothedBestClassChange'

	// forward the event
	window.dispatchEvent(new CustomEvent("slouchingOrNotEvent", {
		detail: slouchingOrNotEvent
	}))
})

