import ModelConstants from '../../../src/model-constants.js'

////////////////////////////////////////////////////////////////////////
//	define timelines for isSlouching, and notSlouching
////////////////////////////////////////////////////////////////////////

// let soundURLs = {
// 	isSlouching : 'ui/sounds/freesounds/351167__reitanna__that-s-bad.wav',
// 	notSlouching : 'ui/sounds/freesounds/277021__sandermotions__applause-2.wav',
// }
let soundURLs = {
	isSlouching : 'ui/sounds/zedge/gentle_alarm.mp3',
	notSlouching : 'ui/sounds/zedge/gentle_roll.mp3',
}
let isSlouchingTimelineSteps = [
	{
		delay: 0,
		callback: function () {
			soundPlay(soundURLs.isSlouching)
		}
	},
	{
		delay: 10000,
		callback: function () {
			soundPlay(soundURLs.isSlouching)
		}
	},
	{
		delay: 20000,
		callback: function () {
			soundPlay(soundURLs.isSlouching)
		}
	},
]
let notSlouchingTimelineSteps = [
	{
		delay: 0,
		callback: function () {
			soundPlay(soundURLs.notSlouching)
		}
	},
]


////////////////////////////////////////////////////////////////////////
//		Play Sounds
////////////////////////////////////////////////////////////////////////

window.addEventListener('slouchingOrNotEvent', (domEvent) => {
	let slouchingOrNotEvent = domEvent.detail
	// keep only 'smoothedBestClassChange' event
	if (slouchingOrNotEvent.type !== 'smoothedBestClassChange') return

	// log to debug
	// console.log(`smoothedBestClassChange smoothBestClass ${slouchingOrNotEvent.smoothedBestClass}`)

	if (slouchingOrNotEvent.smoothedBestClass === ModelConstants.CLASS_INDEXES.isSlouching) {
		timelineStart(isSlouchingTimelineSteps)
	} else if (slouchingOrNotEvent.smoothedBestClass === ModelConstants.CLASS_INDEXES.notSlouching) {
		// do not start the timeline if the change is due to a isGoodEnough === false
		// if( slouchingOrNotEvent.isGoodEnough === false ){
		// 	soundStop()
		// 	timelineStop()
		// 	return
		// }
		timelineStart(notSlouchingTimelineSteps)
	} else {
		console.assert(false, `unknown smoothBestClass ${slouchingOrNotEvent.smoothedBestClass}`)
	}
})


////////////////////////////////////////////////////////////////////////
//	handle notificationAudioEl
////////////////////////////////////////////////////////////////////////

let timelineSteps = null
let timelineStepIndex = 0
let timelineTimerID = null

/**
 * 
 * @param {Array[{delay: Number, callback: Function}]} timeline the timeline to execute
 */
function timelineStart(newTimelineSteps) {
	// if there is a newTimelineSteps in progress, stop it now
	if (timelineSteps !== null) timelineStop()

	// console.log('timelineStart', newTimelineSteps)

	// reset timelineSteps with the new value
	timelineSteps = newTimelineSteps
	timelineStepIndex = 0

	// run next step
	timelineRunNextStep()

}

function timelineRunNextStep() {
	if (timelineStepIndex >= timelineSteps.length) {
		// console.log('timeline ended')
		timelineStop()
		return
	}

	let timelineStep = timelineSteps[timelineStepIndex]
	// console.log(`timelineRunNextStep: wait for ${timelineStep.delay}-ms to call ${timelineStepIndex}th steps`)
	timelineTimerID = setTimeout(function () {
		// console.log(`timelineRunNextStep: call ${timelineStepIndex}th steps`)
		timelineStep.callback()

		timelineStepIndex++

		timelineRunNextStep()
	}, timelineStep.delay)
}

function timelineStop() {
	// log to debug
	// console.log(`timelineStop:`)

	// clearTimeout if needed
	if (timelineTimerID !== null) clearTimeout(timelineTimerID)
	timelineTimerID = null
	timelineSteps = null
	timelineStepIndex = 0

}

////////////////////////////////////////////////////////////////////////
//		Handle #soundVolumeLabelID
////////////////////////////////////////////////////////////////////////
// get initial #soundVolumeRangeID value from localStorage if available
if (localStorage.getItem('slouchingOrNot-predict-soundVolume') !== null) {
	let value = parseFloat(localStorage.getItem('slouchingOrNot-predict-soundVolume'))
	document.querySelector('#soundVolumeRangeID').value = value
	document.querySelector('#soundVolumeLabelID').innerHTML = value
}

// update #soundVolumeLabelID when #soundVolumeRangeID change, and update localStorage
document.querySelector('#soundVolumeRangeID').addEventListener("input", function () {
	var value = parseFloat(document.querySelector('#soundVolumeRangeID').value)
	// update UI
	document.querySelector('#soundVolumeLabelID').innerHTML = value
	// store new value in localStorage
	localStorage.setItem('slouchingOrNot-predict-soundVolume', value);
	// update current soundVolume
	soundVolume(value)
}, false);


////////////////////////////////////////////////////////////////////////
//	handle notificationAudioEl
////////////////////////////////////////////////////////////////////////

/**
 * Audio domElement of the current playing sound. null if no sound is playing.
 * @type {HTMLMediaElement}
 */
var notificationAudioEl = null

/**
 * Play a sound notification.
 * 
 * @param {string} soundURL the url pointing to the sound
 * @param {Number} volume the volume of the sound between [0, 1]
 */
function soundPlay(soundURL) {
	// honor the muteID UI
	let shouldBeMuted = document.querySelector('#muteID').checked ? true : false
	if (shouldBeMuted === true) return

	// stop currently playing sound if any
	if (notificationAudioEl !== null) {
		notificationAudioEl.pause()
		notificationAudioEl = null
	}

	// get masterVolume from UI
	var masterVolume = parseFloat(document.querySelector('#soundVolumeRangeID').value)

	// create the new audio element 
	var audioEl = new Audio(soundURL);
	audioEl.volume = masterVolume
	audioEl.play();

	// once the sound is ended, set notificationAudioEl to null
	audioEl.addEventListener('ended', function () {
		soundStop()
	})

	// update notificationAudioEl
	notificationAudioEl = audioEl
}

function soundStop() {
	// // if no sound is in progress, return now
	// if (notificationAudioEl === null) return
	// // stop the sound
	// notificationAudioEl.pause()
	// notificationAudioEl = null
}

function soundMute(shouldBeMuted) {
	// handle default arguments
	if (shouldBeMuted === undefined) shouldBeMuted = true
	// if no sound is in progress, return now
	if (notificationAudioEl === null) return
	// set the muted attribute
	notificationAudioEl.muted = shouldBeMuted
}

function soundVolume(newVolume) {
	// if no sound is in progress, return now
	if (notificationAudioEl === null) return
	// set the muted attribute
	notificationAudioEl.volume = newVolume
}

////////////////////////////////////////////////////////////////////////
//		Handle MuteID
////////////////////////////////////////////////////////////////////////

document.querySelector('#muteID').addEventListener('change', function () {
	let shouldBeMuted = document.querySelector('#muteID').checked ? true : false
	soundMute(shouldBeMuted)
})