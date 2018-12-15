import ModelConstants from '../../src/model-constants.js'


window.addEventListener('slouchingOrNotEvent', (domEvent) => {
	let slouchingOrNotEvent = domEvent.detail
	// keep only 'smoothedPrediction' event
	if (slouchingOrNotEvent.type !== 'smoothedBestClassChange') return

	
	if( slouchingOrNotEvent.smoothedBestClass === ModelConstants.CLASS_INDEXES.isSlouching ){
		// playSound('predict-skins/sounds/265012__sethlind__toaster-oven-ding.wav', 0.05)
		// playSound('predict-skins/sounds/341601__mike-stranks__gentle-stream.wav', 0.3)
		playSound('predict-skins/sounds/351167__reitanna__that-s-bad.wav', 0.3)
	}else if( slouchingOrNotEvent.smoothedBestClass === ModelConstants.CLASS_INDEXES.notSlouching ){
		playSound('predict-skins/sounds/277021__sandermotions__applause-2.wav', 0.1)
	}else {
		console.assert(false, `unknown smoothBestClass ${slouchingOrNotEvent.smoothedBestClass}`)
	}
})


////////////////////////////////////////////////////////////////////////
//	handle notification sounds
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
function playSound(soundURL, volume) {
	// honor the muteID UI
	let shouldBeMuted = document.querySelector('#muteID').checked ? true : false
	if( shouldBeMuted === true )	return

	// stop currently playing sound if any
	if( notificationAudioEl !== null ){
		notificationAudioEl.pause()
		notificationAudioEl = null
	}

	// create the new audio element 
	var audioEl = new Audio(soundURL);
	audioEl.volume = volume
	audioEl.play();

	// once the sound is ended, set notificationAudioEl to null
	audioEl.addEventListener('ended', function(){
		notificationAudioEl.pause()
		notificationAudioEl = null
	})

	// update notificationAudioEl
	notificationAudioEl = audioEl
}

////////////////////////////////////////////////////////////////////////
//		Handle MuteID
////////////////////////////////////////////////////////////////////////

document.querySelector('#muteID').addEventListener('change', function(){
	// if no sound is in progress, return now
	if( notificationAudioEl === null )	return

	let shouldBeMuted = document.querySelector('#muteID').checked ? true : false
	notificationAudioEl.muted = shouldBeMuted
})