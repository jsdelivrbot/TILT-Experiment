// Function Call to Run the experiment
function runExperiment(trials, subjCode, workerId, assignmentId, hitId) {
    let timeline = [];


    // Data that is collected for jsPsych
    let turkInfo = jsPsych.turk.turkInfo();
    let participantID = makeid() + 'iTi' + makeid()

    jsPsych.data.addProperties({
        subject: participantID,
        condition: 'explicit',
        group: 'shuffled',
        workerId: workerId,
        assginementId: assignmentId,
        hitId: hitId
    });

    let welcome_block = {
        type: "text",
        cont_key: ' ',
        text: `<h1>TYP_v2</h1>
        <p>Welcome to the experiment. Thank you for participating! Press SPACE to begin.</p>`
    };

    timeline.push(welcome_block);

    let continue_space = "<div class='right small'>(press SPACE to continue, or BACKSPACE to head back)</div>";

    let instructions = {
        type: "instructions",
        key_forward: ' ',
        key_backward: 8,
        pages: [
            `<p>In this short study you will be seeing some shapes in the middle of the screen that are 
            tilted to the left or right. Your task is to adjust a white bar below the shapes so that its 
            tilt matches that of the shapes. Use the mouse-wheel to adjust the tilt of the bar. When you 
            are satisfied, press the SPACE button to proceed to the next trial. You will start with 
            some practice trials to get the hang of the task.</p> ${continue_space}`,

            `<p>Try to be as accurate as you can, but don't spend too much time on any one trial.</p> ${continue_space}`
        ]
    };

    timeline.push(instructions);

    // Pushes each audio trial to timeline
    _.forEach(trials, (trial) => {
        // Empty Response Data to be sent to be collected
        let response = {
            subjCode: subjCode,
            seed: trial.seed,    //seed can be changed in TYP_genTrials.py file
            ori: trial.ori,
            respMapping: trial.respMapping,
            room: trial.room,
            date_time: moment().format('MMMM Do YYYY, h:mm:ss a'),
            expName: trial.expName,
            standardStim: trial.standardStim,
            textShown: trial.textShown,
            frame: trial.frame,
            tilt: trial.tilt,
            direction: trial.direction,
            orientation: trial.orientation,
            adjustingStim: trial.adjustingStim,
            standardStimPos: trial.standardStimPos,
            adjustingStimPos: trial.adjustingStimPos,
            trialType: 'real',  //either real or practice
            numWheelTurnsUp: '',
            numWheelTurnsDown: '',
            response: '',
            absResponse: '',    //absolute value of response
            rt: -1
        }	

        var tiltTrial = {
            type: 'single-stim',
            stimulus: '<img style="display: block; margin: 0 auto;"src="stimuli/'+trial.standardStim+'.png" />',
            prompt: tiltHtml,
            is_html: true
        }

        timeline.push(tiltTrial);

    })


    let endmessage = `Thank you for participating! Your completion code is ${participantID}. Copy and paste this in 
        MTurk to get paid. If you have any questions or comments, please email jsulik@wisc.edu.`



    jsPsych.init({
        default_iti: 0,
        timeline: timeline,
        // fullscreen: true,
        on_finish: function (data) {
            jsPsych.endExperiment(endmessage);
        }
    });
}

let tiltHtml = `
<p id="angle">Angle: <br>Up: <br>Down:</p>
<script>
angle = 0;
up = 0;
down = 0;
$(document).ready(function(){

    /** This is high-level function.
         * It must react to delta being more/less than zero.
         */
    function handle(delta) {
        var ratio = 2;  // scroll to angle ratio
        var max = 20;
        var min = -20;

        if (delta < 0 && angle < max) {
            angle+= 0.5/ratio;
            up+= 0.5/ratio;
            $("#angle").html( "Angle: " + angle + "<br>Up: " + up + "<br>Down: " + down ); // assuming scroll 2 lines at a time
        }
        else if (delta > 0 && angle > min) {
            angle-= 0.5/ratio
            down+= 0.5/ratio;
            $("#angle").html( "Angle: " + angle + '<br>Up: ' + up + "<br>Down: " + down );
        }
    }

    /** Event handler for mouse wheel event.
     */
    function wheel(event){
            var delta = 0;
            if (!event) /* For IE. */
                    event = window.event;
            if (event.wheelDelta) { /* IE/Opera. */
                    delta = event.wheelDelta/120;
            } else if (event.detail) { /** Mozilla case. */
                    /** In Mozilla, sign of delta is different than in IE.
                     * Also, delta is multiple of 3.
                     */
                    delta = -event.detail/3;
            }
            /** If delta is nonzero, handle it.
             * Basically, delta is now positive if wheel was scrolled up,
             * and negative, if wheel was scrolled down.
             */
            if (delta)
                    handle(delta);
            /** Prevent default actions caused by mouse wheel.
             * That might be ugly, but we handle scrolls somehow
             * anyway, so don't bother here..
             */
            if (event.preventDefault)
                    event.preventDefault();
        event.returnValue = false;
    }

    /** Initialization code.
     * If you use your own event management code, change it as required.
     */
    if (window.addEventListener)
            /** DOMMouseScroll is for mozilla. */
            window.addEventListener("DOMMouseScroll", wheel, false);
    /** IE/Opera. */
    window.onmousewheel = document.onmousewheel = wheel;

});
</script>

<canvas id="myCanvas" width="578" height="200" style="display: block; margin: 0 auto;"></canvas>
<script>
var img = new Image();
img.onload = function() {
    var canvas = document.getElementById("myCanvas");
    var w = 50;
    var h = 100;
    function draw() {
        var context = canvas.getContext("2d");
        canvas.width = canvas.width;
        // translate context to center of canvas
        context.translate(canvas.width / 2, canvas.height / 2);
        context.rotate(angle*Math.PI/180);

        context.drawImage(img, w/-2, h/-2, w, h);

        window.requestAnimationFrame(draw);
    }
    draw();
}
img.src = "img/gabor.png";
</script>
`