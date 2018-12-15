const CLASS_NAMES = ['isSlouching', 'notSlouching']
const CLASS_INDEXES = {
	isSlouching : CLASS_NAMES.indexOf('isSlouching'),
	notSlouching : CLASS_NAMES.indexOf('notSlouching'),
}
const NUM_CLASSES = CLASS_NAMES.length
const POSENET_WIDTH = 224



const KeypointNames = ["nose", "leftEye", "rightEye", "leftEar", "rightEar", "leftShoulder", "rightShoulder",
	"leftElbow", "rightElbow", "leftWrist", "rightWrist", "leftHip", "rightHip",
	"leftKnee", "rightKnee", "leftAnkle", "rightAnkle"]
const KeypointIndexes = {}
for(let keypointIndex = 0; keypointIndex < KeypointNames.length; keypointIndex++){
	KeypointIndexes[KeypointNames[keypointIndex]] = keypointIndex
}

const featureVectorKeypointIndexes = [
	KeypointIndexes['nose'],
	KeypointIndexes['leftEye'],
	KeypointIndexes['rightEye'],
	KeypointIndexes['leftEar'],
	KeypointIndexes['rightEar'],
	KeypointIndexes['leftShoulder'],
	KeypointIndexes['rightShoulder'],
]

// es6 export
export default {
	NUM_CLASSES,

	CLASS_NAMES,
	CLASS_INDEXES,

	POSENET_WIDTH,

	KeypointIndexes,
	KeypointNames,
	featureVectorKeypointIndexes,
}
