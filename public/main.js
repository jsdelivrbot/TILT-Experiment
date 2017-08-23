
$(document).ready(function(){

    // This listens to the form on-submit action
    $("form").submit(function(){    // Remove


        //////////////////////////////////////////
        // DEFINE workerId, hitId, assignmentId HERE
        //////////////////////////////////////////
        let subjCode = $("#subjCode").val();
        let workerId = 'workerId';
        let assignmentId = 'assignmentId';
        let hitId = 'hitId';
        let options = {
            subjCode: $("#subjCode").val(),
            lang: $('#lang').val(),
            seed: $('#seed').val(),
            frame: $('#frame').val(),
            ori: $('#ori').val(),
            respMapping: $('#respMapping').val(),
            expName: $('#expName').val()
        };
        $("form").remove();

        $("#loading").html('Loading trials... please wait. </br> <img src="img/preloader.gif">')

        // This calls server to run python generate trials (generateTrials.py) script
        // Then passes the generated trials to the experiment
        $.ajax({
            url: '/trials',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({options: options}),
            success: function (data) {
                console.log(data);
                $("#loading").remove();
                runExperiment(data.trials, subjCode, workerId, assignmentId, hitId, options);
            }
        })
    }); // Remove
    

});