# Pixel-Survivors
COMP4021 Group 3 Final Project

How to build and run:
1. run 'npm install'
2. run 'cd src' 
3. run 'node server.js'

Members:
hsaegusa@connect.ust.hk
wlwkwong@connect.ust.hk

Project Details:
1. Pixel Survivors

2. A registration/login form and a how-to-play section

3. It is a 2D pixel co-op game where players work together to defeat a boss that spawns several other enemies. The win condition is to deplete the boss' Hit Points (HP) while maximising their score (by damaging the boss and other enemies), If a player loses all HP (dead), he will revive after 15 seconds.

4. When a game ends, the players will be redirected to the ranking page. The ranks are based on the clear time of the game and scores of the two players are shown.

5. Cheat mode can be toggled in the game by pressing BACKSPACE key, and the damage and walking speed of the players increases significantly.

Regarding the server:

1. The game works perfectly fine in localhost, but since it is an action game, it is really hard to play the game by yourself using localhost. 

2. Therefore, we set up a "real" server using AWS(ec2). You can play the game using the link below if you want.
http://ec2-18-162-115-233.ap-east-1.compute.amazonaws.com/

3. We recommend using localhost for marking. The real server is only for demonstation and we cannot guarantee that the server works 100% fine.

4. Feel free to contact Haruki (hsaegusa@connect.ust.hk) if the link is not working.
