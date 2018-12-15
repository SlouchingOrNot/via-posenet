--- 
# Next version based on posenet
- mobilenet-finetuning is to fragile
- if the person goes a bit on the left or right it fails
- how to correct that ?
- using something related to the current position of the body could fix that
  - e.g. if face is below the usual level, then the user is slouching ?

## Data Set
- build data set based on picture of you in front of a webcam
- store the in server
- extract posenet on each of them in node.js
  - single-pose multi-pose
  - store that in a .json
  - raw result
- slouching or not
- then learn from those data set
- make a webapp for that ? 
  - like take picture 224x224
  - make it downloadable as a .zip of jpg
  - or downloadable one by one at first
  - uptothe user to unzip that in the proper repository
  - generic + simple => good
  - call it mobilenet samples capture
- generate posenet data from image in node.js ?
  - or in browser
- /dataset/jpg/slouching
  /dataset/jpg/situpstraight
  /dataset/jpg/tobeignored
  /dataset/posenet/${imagebasename}.posenet.json
  

## Data Canonisation 
- width of the head
- width of the shoulder line
- distance between the head and the shoulder line
    - this distance 
- y of the between-the-eyes in the image ?
- visualisation 
- how can it be estimated

## Learning
- generalisation measures
  - other people 
  - other env
- experiment with the network structure
- hyper parameters tunning
- do you learn in browser or in node.js ?
- can you reuse those data with GPU very fast

## TODO 
- see about mnist tutorial - https://js.tensorflow.org/tutorials/mnist.html
- take this tutorial - make it run in browser and in node.js
- merge it to your posenet after that
- https://github.com/GoogleChromeLabs/ndb
