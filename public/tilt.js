
var angle = 0;
var right = 0;
var left = 0;
$(document).ready(function(){
    function handle(delta) {
        var ratio = 2;  // scroll to angle ratio
        var max = 20;
        var min = -20;
        if (((delta < 0 && respMapping == 'upLeft') || (delta > 0 && respMapping == 'upRight')) && angle < max) {
            angle += 0.5/ratio;
            right += 0.5/ratio;
        }
        else if (((delta > 0 && respMapping == 'upLeft') || (delta < 0 && respMapping == 'upRight')) && angle > min) {
            angle-= 0.5/ratio
            left+= 0.5/ratio;
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
var alarmClock = new Image();
alarmClock.src = "stimuli/alarmClock.png";
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
    canvas = document.getElementById("myCanvas");
    context = canvas.getContext("2d");
    var w = 50;
    var h = 100;
    function draw() {
        canvas.width = canvas.width;    // hacky way to fix stuttering
        context.translate(canvas.width / 2, canvas.height / 2); // translates context to center of canvas

        // draws adjusting stim
        context.save();
        context.translate(aPos[0],-aPos[1]);    // positions stim
        context.rotate(angle*Math.PI/180);
        context.drawImage(img, w/-2, h/-2, w, h);
        context.restore();

        // draws standard stim
        context.save();
        context.translate(sPos[0],-sPos[1]);    // positions stim
        context.drawImage(stim, stim.width/-2, stim.height/-2, stim.width, stim.height);
        context.strokeStyle = 'white';  // some color/style
        context.lineWidth = 1;         // thickness     
        context.strokeRect(stim.width/-2.5, stim.height/-3, stim.width/2.5*2, stim.height/3*2);
        context.stroke();
        context.drawImage(alarmClock, alarmClock.width/-2, alarmClock.height/-2, alarmClock.width, alarmClock.height);
        context.restore();

        // attempting to get true color of web image (flickers when canvas is unloaded)
        // var rgb = context.getImageData(stim.width/-2+sPos[0]+canvas.width/2+5, stim.height/-2+sPos[1]+canvas.height/2+5, 1,1).data;
        // document.getElementById("background").style.background = rgbToHex(rgb[0],rgb[1],rgb[2]);


        window.requestAnimationFrame(draw);
    }
    draw();
}