// This function defines a Sprite module.
// - `ctx` - A canvas context for drawing
// - `x` - The initial x position of the sprite
// - `y` - The initial y position of the sprite
const Sprite = function(ctx, x, y) {

    // This is the image object for the sprite sheet.
    const sheet = new Image();

    // used to notice others when animation ends
    let sequenceEndCallback = null;

    const setSequenceEndCallback = function(newCallback) {sequenceEndCallback = newCallback;}


    // This is an object containing the sprite sequence information used by the sprite containing:
    // - `x` - The starting x position of the sprite sequence in the sprite sheet
    // - `y` - The starting y position of the sprite sequence in the sprite sheet
    // - `width` - The width of each sprite image
    // - `height` - The height of each sprite image
    // - `count` - The total number of sprite images in the sequence
    // - `timing` - The timing for each sprite image
    // - `loop` - `true` if the sprite sequence is looped
    let sequence = { x: 0, y: 0, width: 20, height: 20, count: 1, timing: 0, loop: false, isLeft: false, startingIndex: 0 };

    // ending sequence when a non-looping sequence ends,
    let endSequence = null;

    // This is the index indicating the current sprite image used in the sprite sequence.
    let index = 0;

    // This is the scaling factor for drawing the sprite.
    let scale = 1;

    // This is the updated time of the current sprite image.
    // It is used to determine the timing to switch to the next sprite image.
    let lastUpdate = 0;

    // This function uses a new sprite sheet in the image object.
    // - `spriteSheet` - The source of the sprite sheet (URL)
    const useSheet = function(spriteSheet) {
        sheet.src = spriteSheet;
        return this;
    };

    const getIndex = () => {return index};

    const getCurSequence = function() {
        return {... sequence};
    };

    // This function returns the readiness of the sprite sheet image.
    const isReady = function() {
        return sheet.complete && sheet.naturalHeight != 0;
    };

    // This function gets the current sprite position.
    const getXY = function() {
        return {x, y};
    };

    // This function sets the sprite position.
    // - `xvalue` - The new x position
    // - `yvalue` - The new y position
    const setXY = function(xvalue, yvalue) {
        [x, y] = [xvalue, yvalue];
        return this;
    };

    // This function sets the sprite sequence.
    // - `newSequence` - The new sprite sequence to be used by the sprite
    const setSequence = function(newSequence, newEndSequence = null) {
        if (sequence == newSequence) return;
        sequence = newSequence;
        index = newSequence.startingIndex;
        lastUpdate = 0;
        endSequence = (newEndSequence != null)? newEndSequence : null;
        return this;
    };

    const getScale = () => {return scale;}

    // This function sets the scaling factor of the sprite.
    // - `value` - The new scaling factor
    const setScale = function(value) {
        scale = value;
        return this;
    };


    // This function gets the display size of the sprite.
    const getDisplaySize = function() {
        /* Find the scaled width and height of the sprite */
        const scaledWidth  = sequence.width * scale;
        const scaledHeight = sequence.height * scale;
        return {width: scaledWidth, height: scaledHeight};
    };

    // This function draws the sprite.
    const drawSprite = function() {
        /* Save the settings */
        ctx.save();

        /* Get the display size of the sprite */
        const size = getDisplaySize();

        
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(sheet, sequence.x + index * sequence.width, sequence.y, sequence.width, sequence.height, 
            x - size.width / 2, y - size.height / 2, size.width, size.height);

        /* Restore saved settings */
        ctx.restore();
    };

    // draw a box for debugging
    const drawBox = function(box) {
        ctx.rect(box.getLeft(), box.getTop(), box.getRight() - box.getLeft(), box.getBottom() - box.getTop());
        ctx.stroke();
    };
     
    // This function draws the sprite.
    const draw = function() {
        if (!isReady()) return; 

        drawSprite();
        return this;
    };

    // This function updates the sprite by moving to the next sprite
    // at appropriate time.
    // - `time` - The timestamp when this function is called
    const update = function(time) {

        if (lastUpdate == 0) lastUpdate = time;

        /* Move to the next sprite when the timing is right */
        if ((time - lastUpdate) < sequence.timing) return;

        if (sequence.loop) {
            if (sequence.isLeft) {
                index--;
                if (index < sequence.startingIndex + 1 - sequence.count)
                index = sequence.startingIndex;
            }
            else {
                index = (index + 1) % sequence.count;
            }
        } 

        /* not looping */
        else if (sequence.isLeft) {
            // left animation
            if (index > sequence.startingIndex + 1 - sequence.count)
                index--;

            else {
                if (endSequence != null) 
                // left animation ends (not looping)
                    setSequence(endSequence);
                if (sequenceEndCallback != null) sequenceEndCallback();
            }

            
        }
        // right animation
        else  {
            if (index < sequence.count - 1){
                // animation continues
                index++;
                
            }

            else {
                if (endSequence != null) 
                    setSequence(endSequence);
                if (sequenceEndCallback != null) sequenceEndCallback();
            }


        }
        
        lastUpdate = time;

        return this;
    };

    // The methods are returned as an object here.
    return {
        useSheet: useSheet,
        getXY: getXY,
        setXY: setXY,
        setSequence: setSequence,
        getScale: getScale,
        setScale: setScale,
        drawBox: drawBox,
        getDisplaySize: getDisplaySize,
        getCurSequence: getCurSequence,
        isReady: isReady,
        draw: draw,
        update: update,
        setSequenceEndCallback: setSequenceEndCallback,
        getIndex: getIndex,
    };
};
