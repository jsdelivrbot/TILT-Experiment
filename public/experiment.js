// Function Call to Run the experiment
function runExperiment(trials, subjCode, workerId, assignmentId, hitId, options) {
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
    };
    
    if (options.lang == 'e')
        welcome_block.text = `<h1>TYP_v2</h1>
        <p>Welcome to the experiment. Thank you for participating! Press SPACE to begin.</p>`
    else if (options.lang == 'h')
        welcome_block.text = `<h1>TYP_v2</h1>
        <p>Translate to Hebrew: Welcome to the experiment. Thank you for participating! Press SPACE to begin.</p>`

    timeline.push(welcome_block);

    let continue_space = "<div class='right small'>(press SPACE to continue, or BACKSPACE to head back)</div>";

    let instructions = {
        type: "instructions",
        key_forward: ' ',
        key_backward: 8
    };
    if (options.lang == 'e')
        instructions.pages = [
            `<p>In this short study you will be seeing some shapes in the middle of the screen that are 
            tilted to the left or right. Your task is to adjust a white bar below the shapes so that its 
            tilt matches that of the shapes. Use the mouse-wheel to adjust the tilt of the bar. When you 
            are satisfied, press the SPACE button to proceed to the next trial. You will start with 
            some practice trials to get the hang of the task.</p> ${continue_space}`,

            `<p>Try to be as accurate as you can, but don't spend too much time on any one trial.</p> ${continue_space}`
        ] 
    else if (options.lang == 'h')
          instructions.pages = [
            `<p>Translate to Hebrew: In this short study you will be seeing some shapes in the middle of the screen that are 
            tilted to the left or right. Your task is to adjust a white bar below the shapes so that its 
            tilt matches that of the shapes. Use the mouse-wheel to adjust the tilt of the bar. When you 
            are satisfied, press the SPACE button to proceed to the next trial. You will start with 
            some practice trials to get the hang of the task.</p> ${continue_space}`,

            `<p>Try to be as accurate as you can, but don't spend too much time on any one trial.</p> ${continue_space}`
        ]       

    timeline.push(instructions);

    // Pushes each audio trial to timeline
    _.forEach(trials, (trial) => {
        // parses the positions from "( #, # )" to [#, #] array
        // standardStimPos.push(_.map(trial.standardStimPos.split(','), (coord) => {return Number(coord.replace(/[^-?0-9]+/g, ''))}));
        // adjustingStimPos.push(_.map(trial.adjustingStimPos.split(','), (coord) => {return Number(coord.replace(/[^-?0-9]+/g, ''))}));
        // stims.push('stimuli/'+trial.standardStim+'.png');
        // respMappings.push(trial.respMapping);
        // Empty Response Data to be sent to be collected
        let response = {
            subjCode: subjCode,
            seed: trial.seed,
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
            numWheelTurnsUp: -1,
            numWheelTurnsDown: -1,
            response: -1,
            absResponse: -1,    //absolute value of response
            rt: -1,
            expTime: -1
        }

        let tiltHTML = '';	
        $.ajax({
            url: 'tilt.html',
            success: function(html) {
                tiltHTML = html;
            },
            async:false
        });
        // console.log(_.map(trial.adjustingStimPos.split(','), (coord) => {return Number(coord.replace(/[^-?0-9]+/g, ''))}));
        // let sPos = _.map(trial.standardStimPos.split(','), (coord) => {return Number(coord.replace(/[^-?0-9]+/g, ''))});
        // let aPos = _.map(trial.adjustingStimPos.split(','), (coord) => {return Number(coord.replace(/[^-?0-9]+/g, ''))});
        let sPos = trial.standardStimPos.slice(1,-1);
        let aPos = trial.adjustingStimPos.slice(1,-1);
        let respMapping = trial.respMapping;
        var tiltTrial = {
            type: 'single-stim',
            // stimulus: '<canvas id="myCanvas" width="600" height="600" style="display: block; margin: 0 auto;"></canvas>',
            stimulus:`
                <script>
                    var sPos = [${sPos}];
                    var aPos = [${aPos}];
                    var respMapping = '${respMapping}';
                    var stim = new Image();     
                    stim.src = 'stimuli/${trial.standardStim}.png';
                </script>`,
            choices: [32],
            prompt: tiltHTML,
            is_html: true,
            on_finish: function(data) {
                console.log("trial finished");
                response.numWheelTurnsUp = up;
                response.numWheelTurnsDown = down;
                response.response = angle;
                response.absResponse = Math.abs(angle);
                response.rt = data.rt;
                response.expTime = data.time_elapsed;
                // POST response data to server
                $.ajax({
                    url: '/data',
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify(response),
                    success: function () {
                        console.log(response);
                    }
                })
            }
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
// let standardStimPos = [];
// let adjustingStimPos = [];
// let stims = [];
// let respMappings = [];