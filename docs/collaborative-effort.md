# Collaborative Effort


# Why Collaboration is Good ?
- since the begining of slouchingOrNot, i did 2 implementations.
- one using raw image classification (fine tuning a mobilenet)
- one using posenet, a human pose detection AI.


the posenet version is working well for me.
But i am still a beginner at machine learning.
It is likely that this version got a lot of naive mistakes in it, but that i dunno them.
Some other people may be able to see them.
More experienced people may be interested and improve the concepts

Maybe a completly different approach is better...

Here the goal is to help people

On the fine-tuned mobilenet
- it is very fragile
- if the background of the image change, the classification changes randomly
- if the lighting change, the classification changes
- if you wear a cap or a hat, the classification changes
- All this to say that many changes in the image are irrelevant to know if you are slouching or not, and they should be ignored by the classification
- raw-image classification can not ignore those... and thus is very fragile

- i was a beginner, and i did a begginer mistake.
- i did this one, because i was so new and excited with machine learning, i tried the first thing that came to my mind.
- now i realise how naive this was to use a fine-tuned mobilenet
- i should have known before and never implement it
