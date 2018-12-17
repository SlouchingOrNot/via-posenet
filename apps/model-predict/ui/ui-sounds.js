import ModelConstants from '../../../src/model-constants.js'

////////////////////////////////////////////////////////////////////////
//	define timelines for isSlouching, and notSlouching
////////////////////////////////////////////////////////////////////////

let isSlouchingTimelineSteps = [
	{
		delay: 0,
		callback: function () {
			soundPlay('ui/sounds/351167__reitanna__that-s-bad.wav', 0.3)
		}
	},
	{
		delay: 10000,
		callback: function () {
			soundPlay('ui/sounds/351167__reitanna__that-s-bad.wav', 0.3)
		}
	},
	{
		delay: 20000,
		callback: function () {
			soundPlay('ui/sounds/351167__reitanna__that-s-bad.wav', 0.3)
		}
	},
]
let notSlouchingTimelineSteps = [
	{
		delay: 0,
		callback: function () {
			soundPlay('ui/sounds/277021__sandermotions__applause-2.wav', 0.1)
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
		soundMute()
		timelineStart(isSlouchingTimelineSteps)
	} else if (slouchingOrNotEvent.smoothedBestClass === ModelConstants.CLASS_INDEXES.notSlouching) {
		soundMute()
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
function soundPlay(soundURL, volume) {
	// honor the muteID UI
	let shouldBeMuted = document.querySelector('#muteID').checked ? true : false
	if (shouldBeMuted === true) return

	// stop currently playing sound if any
	if (notificationAudioEl !== null) {
		notificationAudioEl.pause()
		notificationAudioEl = null
	}

	// create the new audio element 
	var audioEl = new Audio(soundURL);
	audioEl.volume = volume
	audioEl.play();

	// once the sound is ended, set notificationAudioEl to null
	audioEl.addEventListener('ended', function () {
		notificationAudioEl.pause()
		notificationAudioEl = null
	})

	// update notificationAudioEl
	notificationAudioEl = audioEl
}

function soundMute(shouldBeMuted) {
	// handle default arguments
	if (shouldBeMuted === undefined) shouldBeMuted = true
	// if no sound is in progress, return now
	if (notificationAudioEl === null) return
	// set the muted attribute
	notificationAudioEl.muted = shouldBeMuted
}

////////////////////////////////////////////////////////////////////////
//		Handle MuteID
////////////////////////////////////////////////////////////////////////

document.querySelector('#muteID').addEventListener('change', function () {
	let shouldBeMuted = document.querySelector('#muteID').checked ? true : false
	soundMute(shouldBeMuted)
})