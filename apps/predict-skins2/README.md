# predict skins 2

## What is it ?
It is kindof UI plugins which listen to slouchingOrNotEvent event generated on window domElement.
I needed a way to externalize all the UI things. 

## Why separating AI and UI
They are very specific to the user wish, so any single UI will satisfy only a portion of the users.
I wanted it to be easy to plug your own UI based on the slouchingOrNot prediction.

From a code point of view, UI tends to be large. It may confuse the code of the AI and make it 
harder to maintain. So splitting the AI and its UI seems a good idea.

