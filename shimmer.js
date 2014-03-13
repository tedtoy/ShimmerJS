

var Shimmer = (function(){

    // maybetodo: private variables set through instance methods

    return {
        canvas: '',
        ctx: undefined,
        font: "30pt Helvetica",
        currTime: Date.now(),
        diffTime: 0,
        spread: 0,
        paused: false,
        pausedTime: 0,
        pauseInterval: 850,
        lightSource: 0,
        inc: 0.032,
        lightSpread: 0.55,
        animations: ['slide','slide','slide','glow'],
        currentAnimationIndex: 0,
        keepTime: function(){
            this.diffTime = Date.now() - this.currTime;
            this.currTime = Date.now();
        },
        cycleAnimation: function(){
            this.currentAnimationIndex+=1;
            if(this.currentAnimationIndex >= this.animations.length){
                this.currentAnimationIndex = 0;
            } 
        },
        animate: function(){
            var currentAnimation = this.animations[this.currentAnimationIndex];
            if(currentAnimation === 'glow'){
                return this.animateGlow(); // return glow style
            } else if (currentAnimation === 'slide'){
                return this.animateSlide(); // return slide gradient
            } else {
                console.log("unknown animation type: "+String(currentAnimation));
            }
        },
        animateGlow: function(){
            var glowEnd = 255, 
                rgbStart = 68,
                r = g = b = rgbStart,
                increment = 10,
                interval = 800;
            return function(){
                var smartInc = increment * (this.diffTime/(1000/60));
                if(this.paused){
                    if((Date.now()-this.pausedTime) > interval){
                        r = rgbStart;
                        this.cycleAnimation()
                        this.paused = false;
                    }
                } else {
                    r = parseInt(r + smartInc);
                    if(r>=glowEnd){
                        this.paused = true;
                        this.pausedTime = Date.now()
                    }
                }
                return "rgb("+ r + "," + r + "," + r + ")";
            }
        }(),
        animateSlide: function(){
            var gradient = this.ctx.createLinearGradient(0,0,255,0),
                smartInc = this.inc * (this.diffTime/(1000/60)),
                lightLeft,
                lightRight,
                lightCenter;
            if(this.paused){
                if((Date.now()-this.pausedTime) > this.pauseInterval){
                    this.lightSource = -0.3; 
                    this.cycleAnimation()
                    this.paused = false;
                    return undefined;
                }
            } else {
                this.lightSource += smartInc;
                if(this.lightSource > (1+this.lightSpread)){ 
                    this.paused = true;
                    this.pausedTime = Date.now();
                }
            }
            // lighting positions:
            lightCenter = (this.lightSource > 1) 
                ? 1 
                : this.lightSource;
                if (lightCenter < 0) lightCenter = 0;
            lightLeft = ((this.lightSource - this.lightSpread) < 0) 
                ? 0 
                : this.lightSource - this.lightSpread;
                if (lightLeft > 1) lightLeft = 1;
            lightRight = (this.lightSource + this.lightSpread) > 1 
                ? 1 
                : this.lightSource + this.lightSpread; 
                if (lightRight < 0) lightRight = 0;

            gradient.addColorStop(lightLeft,"#555");
            gradient.addColorStop(lightCenter,"#ffffff");
            gradient.addColorStop(lightRight,"#555");

            return gradient;
        },
        settings: function(dict){
            this.canvas = document.getElementById(dict['canvas']);
            this.ctx = this.canvas.getContext('2d');
            this.font = (typeof dict['font'] !== 'undefined' ) 
                ? dict['font']
                : this.font;
            this.lightSpread = (typeof dict['lightSpread'] !== 'undefined' ) 
                ? dict['lightSpread']
                : this.lightSpread;
            this.inc = (typeof dict['inc'] !== 'undefined' ) 
                ? dict['inc']
                : this.inc;
            this.animations = (typeof dict['animations'] !== 'undefined' ) 
                ? dict['animations']
                : this.animations;
            this.text = (typeof dict['text'] !== 'undefined' ) 
                ? dict['text']
                : this.text;
        },
        on: function(){
            // record the time we ran:
            this.keepTime();
            // clear and fill the canvas:
            this.ctx.clearRect(0,0,255,150);
            this.ctx.font = this.font;
            this.ctx.fillStyle = this.animate();  
            this.ctx.fillText(this.text, 0, 55);
        }
    }
}());

