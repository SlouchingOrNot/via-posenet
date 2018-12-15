**META**: change the order of those sections. start with the why

# Linear Interpolation of Posenet Result

posenet results are skeletons, each composed of a list of keypoint. One keypoint
of rightEyes, one for leftEyes, one for RightShoulder etc...

Linear interpolation between Posenet Result is simply to take one keypoint part
in say posenetResultA and posenetResultB. For this keypoint, we take say 0.3 of
the first posenetResultA, and 0.7 of posenetResultB. We do this operation on
*x*, *y*, and *score*.

This is possible because posenet result are spacial data, so they are confortable
with linear interpolation.

## Why Is This Useful ?
slouchingOrNot is a classification problem with 2 classes: ```isSlouching```
and ```notSlouching```.

When acquiring data, the dataset may have quantum gaps between classes. And it
may cause the learning to arbitrary pick the threshold inside this gaps. If we
augment the data using linear interpolation of Posenet Result, we fill this gap,
and thus provide useful information to the model to learn.

It provides more controls on what the model will learn, and likely more stability
