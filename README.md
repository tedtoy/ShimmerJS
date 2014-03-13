ShimmerJS
=========

A javascript way of shimmering, as seen in Facebook's iOS app, which is particularly useful as a non-abstruse logo indicator. 


Basically this is a JavaScript/canvas clone of [Facebook's shimmer](https://github.com/facebook/Shimmer) which was released on github several days ago.

### [Here Is An Example](http://tedtoy.github.io/ShimmerJS/)


### Why?
Because Facebook did it in objective-C and we all know that javascript and canvas can do the same thing in fewer lines of code.

### How?
    
        // requestAnim shim layer by Paul Irish
        window.requestAnimFrame = (function(){
          return  window.requestAnimationFrame       || 
                  window.webkitRequestAnimationFrame || 
                  window.mozRequestAnimationFrame    || 
                  window.oRequestAnimationFrame      || 
                  window.msRequestAnimationFrame     || 
                  function(/* function */ callback, /* DOMElement */ element){
                    window.setTimeout(callback, 1000 / 60);
                  };
        })();
        Shimmer.settings({
            'canvas': 'shimmer_canvas',
            'text' : 'ShimmerJS',
            'font': '37pt LaneNarrow, Verdana',
            'animations': ['slide','slide','slide','glow']
        });
        function animate() {
            requestAnimFrame( animate );
            Shimmer.on();
        };
        animate();
        
### Neat, what about the animations?
Each animation frame drawn by the requestAnimFrame shim clears and redraws the canvas context with the context.fillStyle set according to which animation is being drawn. 

For sliding, a linear gradient with three colorStops is used (#555, #fff, #555) respectively. The distance between these stops creates the width of the light and a single point on the horizontal axis (which is incremented on every redraw of the animation when not paused) is used to determine the position of the three colorStops on the canvas.

The glow is simply accomplished by adding a white rgb(r,g,b) fillStyle to the context which increases in value at every redraw until rgb(255,255,255) when it pauses.

The animations are stored in an array and a cycleAnimation() is called by the slide and glow functions when they are done with their current animation.

### What else can it do?
You can set properties on the shimmer object directly in order to change the text, font size and style, speed of the sliding animation, the sequence of animations (default: slide, slide slide, glow), and the spead of the sliding light source. This could be extended to be more useable with setter functions (easy), ability to add different types of animations (hard), change size of canvas, change the colors of the gradients or maybe even reverse the direction of the animation (easy).

### Anything else
Yes, the @font-face property is in a sorry state and isn't guaranteed to work in web-kit. Just makes it harder to use cool fonts.
