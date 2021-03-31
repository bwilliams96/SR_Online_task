/**
 * jspsych-image-keyboard-response
 * Josh de Leeuw, Lily Fitzgibbon, Brendan Williams
 *
 * plugin for displaying a stimulus and getting a keyboard response
 *
 * documentation: docs.jspsych.org
 *
 **/


jsPsych.plugins["chose-stimuli"] = (function() {

  var plugin = {};

  jsPsych.pluginAPI.registerPreload('chose-stimuli', 'stimulus', 'image');

  plugin.info = {
    name: 'chose-stimuli',
    description: '',
    parameters: {
      stimulusLeft: {
        type: jsPsych.plugins.parameterType.IMAGE,
        pretty_name: 'stimulus',
        default: undefined,
        description: 'The image to be displayed'
      },
      stimulusRight: {
        type: jsPsych.plugins.parameterType.IMAGE,
        pretty_name: 'stimulus',
        default: undefined,
        description: 'The image to be displayed'
      },
      choices: {
        type: jsPsych.plugins.parameterType.KEYCODE,
        array: true,
        pretty_name: 'Choices',
        default: jsPsych.ALL_KEYS,
        description: 'The keys the subject is allowed to press to respond to the stimulus.'
      },
      prompt: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Prompt',
        default: null,
        description: 'Any content here will be displayed below the stimulus.'
      },
      stimulus_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Stimulus duration',
        default: null,
        description: 'How long to hide the stimulus.'
      },
      highlight: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Image highlighted',
        default: null,
        description: 'Image left or right highlighted with a border. Options: [null, "left", "right", "both"]'
      },
      trial_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Trial duration',
        default: null,
        description: 'How long to show trial before it ends.'
      },
      response_ends_trial: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Response ends trial',
        default: true,
        description: 'If true, trial will end when subject makes a response.'
      }
    }
  }

  plugin.trial = function(display_element, trial) {

    var highlighted = {left: 0, right: 0}

    if (trial.highlight == "left" | trial.highlight == "both"){
      highlighted.left = 5
    }
    if (trial.highlight == "right" | trial.highlight == "both"){
      highlighted.right = 5
    }
    //console.log(highlighted)

    var new_html = '<div class="row" style="display:flex" width="100%">'+
                    '<div class="column" style= "flex:33.33%; padding:10px"><img src="'+trial.stimulusLeft+'" id="jspsych-image-keyboard-response-stimulus" style="width: 100%; height: 100%; outline:'+highlighted.left+'px solid red; outline-offset: -5px"></img></div>'+
                    '<div class="column" style= "flex:33.33%; padding:10px"><img src="'+trial.stimulusRight+'" id="jspsych-image-keyboard-response-stimulus"  style="width: 100%; height: 100%; outline:'+highlighted.right+'px solid red; outline-offset: -5px"></img></div>'+
                    '</div>'


    // add prompt
    if (trial.prompt !== null){
      new_html += trial.prompt;
    }

    // draw
    display_element.innerHTML = new_html;

    // store response
    var response = {
      rt: null,
      key: null
    };

    // function to end trial when it is time
    var end_trial = function() {

      // kill any remaining setTimeout handlers
      jsPsych.pluginAPI.clearAllTimeouts();

      // kill keyboard listeners
      if (typeof keyboardListener !== 'undefined') {
        jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
      }

      // gather the data to store for the trial
      var trial_data = {
        "rt": response.rt,
        "stimulus": trial.stimulus,
        "key_press": response.key
      };

      // clear the display
      display_element.innerHTML = '';

      // move on to the next trial
      jsPsych.finishTrial(trial_data);
    };

    // function to handle responses by the subject
    var after_response = function(info) {

      // after a valid response, the stimulus will have the CSS class 'responded'
      // which can be used to provide visual feedback that a response was recorded
      display_element.querySelector('#jspsych-image-keyboard-response-stimulus').className += ' responded';

      // only record the first response
      if (response.key == null) {
        response = info;
      }

      if (trial.response_ends_trial) {
        end_trial();
      }
    };

    // start the response listener
    if (trial.choices != jsPsych.NO_KEYS) {
      var keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
        callback_function: after_response,
        valid_responses: trial.choices,
        rt_method: 'date',
        persist: false,
        allow_held_key: false
      });
    }

    // hide stimulus if stimulus_duration is set
    if (trial.stimulus_duration !== null) {
      jsPsych.pluginAPI.setTimeout(function() {
        display_element.querySelector('#jspsych-image-keyboard-response-stimulus').style.visibility = 'hidden';
      }, trial.stimulus_duration);
    }

    // end trial if trial_duration is set
    if (trial.trial_duration !== null) {
      jsPsych.pluginAPI.setTimeout(function() {
        end_trial();
      }, trial.trial_duration);
    }

  };

  return plugin;
})();
