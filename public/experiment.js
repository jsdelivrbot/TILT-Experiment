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
            are satisfied, press the left mouse button to proceed to the next trial. You will start with 
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

        // // Audio plays for its duration plus variable delay
        // let audioTrial = {
        //     type: 'single-stim',
        //     stimulus: 'stimuli/sounds/' + trial.soundFile+'.wav',
        //     timing_response: 600 + Number(trial.soa) *1000
        // }
        
        // timeline.push(audioTrial);

        // Picture Trial
        // let pictureTrial = {
        //     type: 'multi-stim-multi-response',
        //     stimuli: ['stimuli/pictures/'+trial.picFile+'.jpg'],
        //     choices: [[90,191]],
        //     timing_stim: [-1],
        //     timing_post_trial: 1000,
        //     on_finish: function (data) {
                
        //         // Check for match
        //         let key = data.key_press.replace(/\D+/g, '');   // Keeps only digits
        //         if ((trial.isMatch == 1 && key == whichyesKey) || (trial.isMatch == 0 && key == whichnoKey)) {
        //             bleep.play();
        //             response.isRight = '1';
        //         }
        //         else{
        //             buzz.play();
        //             response.isRight ='0';
        //         }

        //         response.rt = data.rt.replace(/\D+/g, '');
        //         response.expTimer = data.time_elapsed / 1000;

        //         response.screenRes = screen.width+'x'+screen.height,
        //         response.windowSize = $(window).width()+'x'+$(window).height()
        //         response.date_time = moment().format('MMMM Do YYYY, h:mm:ss a');

        //         // POST response data to server
        //         $.ajax({
        //             url: '/data',
        //             type: 'POST',
        //             contentType: 'application/json',
        //             data: JSON.stringify(response),
        //             success: function () {
        //                 console.log(response);
        //             }
        //         })
        //     }
        // }
        // timeline.push(pictureTrial);
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