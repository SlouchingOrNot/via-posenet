#!/usr/bin/env node

let datasetDirname = process.argv[2]

if( process.argv[2] === '-h' || process.argv[2] === '--help' || process.argv[2] === undefined ){
        console.log('generate-dataset-info.js datasetDirname')
        console.log('')
        console.log('Generate the dataset-info.json for this dataset directory.')
        process.exit(0)
}

let isSlouchingDirname = require('path').join(datasetDirname, 'isSlouching')
let notSlouchingDirname = require('path').join(datasetDirname, 'notSlouching')


let isSlouchingFilenames = require('fs').readdirSync(isSlouchingDirname).map((filename) => 'isSlouching/'+filename)
let notSlouchingFilenames = require('fs').readdirSync(notSlouchingDirname).map((filename) => 'notSlouching/'+filename)
let datasetInfo = {
        posenetResultURLs : [],
        imageURLs : [],
}


datasetInfo.posenetResultURLs[0] = isSlouchingFilenames.filter((x) => x.match(/\.json/))
datasetInfo.posenetResultURLs[1] = notSlouchingFilenames.filter((x) => x.match(/\.json/))
datasetInfo.imageURLs[0] = isSlouchingFilenames.filter((x) => x.match(/\.jpg/))
datasetInfo.imageURLs[1] = notSlouchingFilenames.filter((x) => x.match(/\.jpg/))

console.log(JSON.stringify(datasetInfo, null, '\t'))
