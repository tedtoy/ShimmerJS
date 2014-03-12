

var Shimmer = (function(){
    var canvas = document.getElementById("shimmer");
    var ctx = canvas.getContext('2d');
    ctx.font = "36pt Helvetica";
    var lightSource = 0, 
        lightLeft, 
        lightCenter, 
        lightRight, 
        spread = 0.28, 
        correctedInc;
    return {
        currTime: Date.now(),
        diffTime: 0,
        spread: 0,
        paused: false,
        pausedTime: 0,
        pauseInterval: 850,
        lightSource: 0,
        inc: 0.032,
        lightSpread: 0.55,
        font: "30pt Helvetica",
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
            var glowEnd = 255; 
            var rgbStart = 68;
            var r = g = b = rgbStart;
            var increment = 10;
            var interval = 800;
            return function(){
                var smartInc = increment * (this.diffTime/(1000/60));
                if(this.paused){
                    if((Date.now()-this.pausedTime) > interval){
                        r = rgbStart;
                        this.cycleAnimation()
                        this.paused = false;
                    }
                } else {
                    r =  parseInt(r + smartInc);
                    if(r>=glowEnd){
                        this.paused = true;
                        this.pausedTime = Date.now()
                    }
                }
                return "rgb("+ r + "," + r + "," + r + ")";
            }
        }(),
        animateSlide: function(){
            var gradient = ctx.createLinearGradient(0,0,240,0),
                smartInc = this.inc * (this.diffTime/(1000/60)),
                lightLeft,
                lightRight,
                lightCenter;
                
            if(this.paused){
                if((Date.now()-this.pausedTime) > this.pauseInterval){
                    this.lightSource = -0.3; 
                    this.cycleAnimation()
                    this.paused = false;
                }
            } else {
                this.lightSource += smartInc;
                if(this.lightSource > (1+this.lightSpread)){ 
                    this.paused = true;
                    this.pausedTime = Date.now();
                }
            }
            // lighting positions:
            lightCenter = (this.lightSource > 1) ? 1 : this.lightSource;
            if (lightCenter < 0) lightCenter = 0;
            lightLeft = ((this.lightSource - this.lightSpread) < 0) 
                ? 0 
                : this.lightSource - this.lightSpread;
            if (lightLeft > 1) lightLeft = 1;
            lightRight = (this.lightSource + this.lightSpread) > 1 
                ? 1 
                : this.lightSource + this.lightSpread; 
            if (lightRight < 0) lightRight = 0;
            
            gradient.addColorStop(lightLeft,"#333");
            gradient.addColorStop(lightCenter,"#ffffff");
            gradient.addColorStop(lightRight,"#333");

            return gradient;
        },
        on: function(){

            this.keepTime();

            ctx.clearRect(0,0,250,150);
            ctx.fillStyle = this.animate();  
            ctx.fillText("Shimmer", 10, 40);
            //ctx.font = "20pt arial";
            ctx.fillText(this.currTime, 10, 85);
        }
    }
}());
