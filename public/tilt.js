
var angle = 0;
var up = 0;
var down = 0;
$(document).ready(function(){
    function handle(delta) {
        var ratio = 2;  // scroll to angle ratio
        var max = 20;
        var min = -20;
        if (delta < 0 && angle < max) {
            angle += 0.5/ratio;
            up += 0.5/ratio;
        }
        else if (delta > 0 && angle > min) {
            angle-= 0.5/ratio
            down+= 0.5/ratio;
        }
    }
    function wheel(event){
            var delta = 0;
            if (!event) /* For IE. */
                    event = window.event;
            if (event.wheelDelta) { /* IE/Opera. */
                    delta = event.wheelDelta/120;
            } else if (event.detail) { /** Mozilla case. */
                    delta = -event.detail/3;
            }
            if (delta)
                    handle(delta);
            if (event.preventDefault)
                    event.preventDefault();
        event.returnValue = false;
    }
    if (window.addEventListener)
            /** DOMMouseScroll is for mozilla. */
            window.addEventListener("DOMMouseScroll", wheel, false);
    /** IE/Opera. */
    window.onmousewheel = document.onmousewheel = wheel;
});

var img = new Image();
img.src = "img/gabor.png";
var images = [img, stim];
var imageCount = images.length;
var imagesLoaded = 0;

for(var i=0; i<imageCount; i++){
    images[i].onload = function(){
        imagesLoaded++;
        if(imagesLoaded == imageCount){
            allLoaded();
        }
    }
}
function allLoaded() {
    var canvas = document.getElementById("myCanvas");
    var w = 50;
    var h = 100;
    function draw() {
        var context = canvas.getContext("2d");
        canvas.width = canvas.width;    // hacky way to fix smoothness
        context.translate(canvas.width / 2, canvas.height / 2); // translates context to center of canvas

        // draws adjusting stim
        context.save();
        context.translate(aPos[0],-aPos[1]);    // positions stim
        if (respMapping == "upLeft")
            context.rotate(angle*Math.PI/180);
        else if (respMapping == "upRight")
            context.rotate(-angle*Math.PI/180);
        context.drawImage(img, w/-2, h/-2, w, h);
        context.restore();

        // draws standard stim
        context.save();
        context.translate(sPos[0],-sPos[1]);    // positions stim
        context.drawImage(stim, stim.width/-2, stim.height/-2, stim.width, stim.height);
        context.restore();

        window.requestAnimationFrame(draw);
    }
    draw();
}