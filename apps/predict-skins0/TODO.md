# Purpose
Important to do the first app. thus i can start to actually use it everyday when i code.
It will become actually useful in reminding you to have a good posture at your desk.

- it should work on a normal browser tab
  - typically a pinned tab should do it
- if the user is in isSlouching for more than x time. send a notification

# Widget API
- have model-predict.html emit messages to the parent window if any
- some there, it is possible to controls the widget with some javascript call
- do we assume they are on the same domain ?
  - it is way better if the iframe may be on another domain
  - thus people doesnt even have to host it
  - the client of the widget can be on codepen or other
- important to have this API
  - thus it is possible to do fancy display without polluting the original code
- this apps is about model-predict.html only ? or do it need to do
- possible usage of this widget API ?
  - apps/predict-skins/basic.html
- if the widget is an iframe, it will behave as a widget

# Predict application
- must require a tuning of the y-offset
- maybe tuning the parameters of the predict widget... how to pass that
  - e.g. the smoothing values
- smoothing is a user value... why be in the in the widget itself.
  - it should be in the skin
- what should be the behavior of the widget...
- if iframe notify status-change
  - status to 'isSlouching'
  - status to 'notSlouching'
- if not slouching due to invalid input, pass that in the parameters too
- basic application: notify me when i go isSlouching
  - similar issue than the alarm clock on my phone
  - for the notification follow the similar pattern
- application must propose a start/stop
- application must propose a visual notification too

# Notification
- sound notification
  - gentle sound
  - increasing volume
  - example of gentle alarm - https://www.youtube.com/watch?v=zxup8wZMbz0&vl=en
- what about notification to the fitbit
  - possible with apple watch and co too
  - notification any electronic watch
- visual notification in the app icon via dynamic favicon
  - simply draw on a canvas
