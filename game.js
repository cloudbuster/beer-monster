//constants for different player statuses
var STATUS_H_WAIT = 0;//horizontal
var STATUS_H_WALK = 1;
var STATUS_U_WAIT = 2;//up
var STATUS_U_WALK = 3;
var STATUS_D_WAIT = 4;//down
var STATUS_D_WALK = 5;

//call of library
enchant();

//documentation: http://wise9.github.com/enchant.js/doc/en/

window.onload = function () {

    // Dimensions for the screen
    var screenWidth = 320;
    var screenHeight = 320;
    var pintAmount = 10;
    var pintsConsumed = 0;

    //Each game has at least one game object
    var game = new Game(screenWidth, screenHeight);
    game.fps = 60;
    // The images used in the game must be preloaded
    game.preload('img/monster-32x32.png');
    game.preload('img/pint32x32.png');

    //Exercise5: Make inventory constructor function here
    //Exercise5: Create inventory object here

    //loading the game object to memory
    //game functionality is inside this function
    game.onload = function () {

        /*
         Node Objects are visual objects that build a game:

         Sprite Object:  displaying figures and pictures.
         Label Object:  displaying text.
         Pad Object: displaying player control pad //ui.enchant.js needeed
         Map Object:  displaying game map environment.
         Group Object:  combining objects.
         */

        var label = new Label("Drink the pints!");
        label.x = screenWidth - 100;

        //creating a sprite object
        var spuge = new Sprite(32, 32);
        spuge.x = 8;
        spuge.y = 8;
        spuge.image = game.assets['img/monster-32x32.png'];
        spuge.status = STATUS_H_WAIT;

        // creating a d-pad
        var pad = new Pad();
        pad.x = 0;
        pad.y = 224;

        //Exercise5: create bottles here
        // Array for pints
        var pints = new Array();

        // Push separate (new) Sprite objects to array, set properties and image
        // for Sprite object
        for (var i = 0; i < pintAmount; i += 1) {
            // No separate constructor needed as Sprite has its own constructor
            // and can thus spawn new objects with keyword "new"
            pints.push(new Sprite(32, 32));
            pints[i].x = 16 + Math.floor(Math.random() * (screenWidth - 64));
            pints[i].y = 16 + Math.floor(Math.random() * (screenHeight - 64));
            pints[i].image = game.assets['img/pint32x32.png'];
        }

        //Each Game Object has one Scene Object by default (rootscene)
        // Adding objects to rootScene (default scene)
        game.rootScene.addChild(spuge);
        game.rootScene.addChild(pad);

        //Exercise5: add bottles to scene here
        // The array of pints added
        for (var pint in pints) {
            game.rootScene.addChild(pints[pint]);
        }
        
        game.rootScene.addChild(label);
        
        game.rootScene.backgroundColor = '#c0c0c0';

        spuge.animd = [0, 1, 2];  //down animation frames
        spuge.animh = [3, 4, 5]; //horizontal animation frames
        spuge.animu = [6, 7, 8];  //up animation frames

        spuge.frame = 0;//animation starting frame
        spuge.counter = 0;//animation frame counter

        //eventlistener has two attributes: Event.ENTER_FRAME and an anonymous function
        game.addEventListener(Event.ENTER_FRAME, function () {
            // check input (from key or pad) on every frame
            if (game.input.right) {

                spuge.scaleX = 1; //turn to right
                spuge.x += 2; //move to right
                spuge.status = STATUS_H_WALK;

            } else if (game.input.left) {
                //Exercise4
                spuge.scaleX = -1; // flip left
                spuge.x -= 2; //move left
                spuge.status = STATUS_H_WALK;

            } else if (game.input.down) {

                spuge.y += 2; //move down
                spuge.status = STATUS_D_WALK;

            } else if (game.input.up) {

                spuge.y -= 2; //move up
                spuge.status = STATUS_U_WALK;
            } else {
                if (spuge.status === STATUS_H_WALK)
                {
                    spuge.status = STATUS_H_WAIT;
                }
                //Exercise4: check other stoppings
                if (spuge.status === STATUS_D_WALK)
                {
                    spuge.status = STATUS_D_WAIT;
                }
                if (spuge.status === STATUS_U_WALK)
                {
                    spuge.status = STATUS_U_WAIT;
                }
            }

            //animate spuge by frame change
            spuge.counter++;

            if (spuge.status === STATUS_H_WAIT) {
                spuge.frame = spuge.animh[0];
            } else if (spuge.status === STATUS_H_WALK) {
                // x%4 creates always numbers 0,1,2,3,0,1,2,3...
                // in my case x%3
                spuge.frame = spuge.animh[spuge.counter % 3];
            }

            //Exercise4: do other animations here
            else if (spuge.status === STATUS_D_WAIT) {
                spuge.frame = spuge.animd[0];
            } else if (spuge.status === STATUS_D_WALK) {
                // x%4 creates always numbers 0,1,2,3,0,1,2,3...
                // in my case x%3
                spuge.frame = spuge.animd[spuge.counter % 3];
            } else if (spuge.status === STATUS_U_WAIT) {
                spuge.frame = spuge.animu[0];
            } else if (spuge.status === STATUS_U_WALK) {
                // x%4 creates always numbers 0,1,2,3,0,1,2,3...
                // in my case x%3
                spuge.frame = spuge.animu[spuge.counter % 3];
            }

            //Exercise5: collision detection here
            for (var pint in pints) {
                if (spuge.intersect(pints[pint])) {
                    game.rootScene.removeChild(pints[pint]);
                    pintsConsumed += 1;
                    if (pintsConsumed > pintAmount){
                        label.text = "Well Done!";
                        //label.x = (screenWidth/2)-35;
                        //label.y = screenHeight/2;
                    }
                    
                }
            }

            //Exercise5: inventorylabel text update here, so you can see it
            //when game starts
            
        });//event listener ends


        //Exersise5: looped eventlistener for removing boottles
        /*
         for (var i = 0; i < 10; i++) {

         bottle[i].addEventListener(Event.REMOVED_FROM_SCENE, function() {


         });//event listener ends
         }
         */


    };
    game.start();
};