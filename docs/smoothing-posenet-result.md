# Smoothing Posenet Result
The whole algorithm relies on posenet results.
While those are impressive by their robustness, they are noisy. The predicted
positions are shaking quite a bit.

In order to reduce, this shakyness we just apply a lerp on the positions/score
of each posenet keypoint.

It is mostly important during the dataset acquisition. If we capture a noisy data
in the dataset, this particular instance of the noise becomes **authoritative**.
It will be seen as something the model should mimics. It will drive our learning
in a wrong direction. Additionaly, this particular noise will be processed by
data augmentation, and be widely exagerated.
