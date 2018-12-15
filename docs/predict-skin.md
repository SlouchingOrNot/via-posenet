# Predict Skin

TODO find a better name to this apps

The prediction is likely the application that will be the more frequently used.
The other applications like [model-learn](model-learn.html) and [model-build](model-build.html) will be used 
only once when setting up. 
[dataset-view](dataset-view.html) is used only during development.
Thus its UI should be a lot more polished and may even be personalized depending on the case.

So we provide a iframe-as-service system (**NOTE**: ). [model-predict](model-predict.html) is the iframe 
doing the heavy work. It emit messages to the parent window, and it is up to the parent window to act accordingly.

For examples, should predict-skins play a sound when the user became isSlouching, or should it display a notification. Which kind of notification ? a flashing red alarm, a popup, a desktop notification... etc... I wont try to do it.


So i will provide a example of predict-skins which fit my personal needs.
Up to you to use/build one which matches your own needs.
