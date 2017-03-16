$(document).foundation();

var DEBUG = false;

// User info retrieved from chats is store in this object
// [TODO] Save this object in local storage/cookie
var context = {};

// Cache conversation position
// [TODO] If user has progresses through a conversation
// We should load it from context and use that position
var conversationPos;

/*
---------------
Utility Functions
---------------
*/
function renderStatement(statement) {
    $('#chat-container').append('<p class="chat-bubble">' + statement + '</p>');
}

function showTyping() {
    $('#chat-container').append('<p class="chat-bubble" id="typing"><span class="dot"></span><span class="dot"></span><span class="dot"></span></p>');
}

function hideTyping() {
    $('#typing').remove();
}

function scrollToBottom() {
    // Scroll to the bottom
    $('#aurora-chat-wrapper').scrollTop(1E10);
}

function checkInput(option) {
    if ($('input[type=text]').val().length > 0) {
        showResponse(option);
    } else {
        alert("What's your name?");
    }
    return false;
}

function clearChat() {
    $('#chat-container').empty();
}

function clearFooter() {
    $('#choices').empty();
    $('#input').empty();
}

/*
---------------
Setup Conversation Data
---------------
*/

function startConversation(conv, pos) {

    clearFooter();
    clearChat();

    // Set conversation position
    // 'conversation' is in the global scope
    conversationPos = conv;

    // Load conversation data
    $.getScript( "js/data.js", function( data ) {

      // Show first bot statement
      showStatement(pos);

    });

}

/*
---------------
Show Bot Statement
---------------
*/
function showStatement(pos) {

    // Where are we in conversationData?
    var node = conversationData[conversationPos][pos];

    // If there is a side effect execute that within the context
    if ('sideeffect' in node && $.type(node['sideeffect'] === "function")) {
        node['sideeffect'](context);
    }

    // Wrap the statements in an array (if they're not already)
    var statements;
    if ($.type(node['statement']) === "array") {
        statements = node['statement'];
    } else if ($.type(node['statement']) === "string") {
        statements = [node['statement']];
    } else if ($.type(node['statement']) === "function") {
        statements = node['statement'](context);
    }

    /*
    ---------------
    Render Bot Statement(s)
    ---------------
    Run this function over each statement
    */
    async.eachSeries(statements, function(item, callback) {

        // Emulate typing then scroll to bottom
        showTyping();
        scrollToBottom();

        // Create random delay
        // If statement is short, delay 1.8 seconds
        // Else, random delay based on statement length
        if (item.length <= 50) {
            var delay = 1800;
        } else {
            var delay = (item.length / 3) * 30 * (Math.floor(Math.random() * 5) + 1.2);
        }

        if (DEBUG) { delay = 0; }

        setTimeout(function() {
            hideTyping();
            renderStatement(item);
            scrollToBottom();

            callback();
        }, delay);
    },

    /*
    ---------------
    Render User Option(s)
    ---------------
    This is the final callback of the series
    */
    function (err) {

        /*
        ---------------
        If User Option is Button(s)
        ---------------
        */
        if ('options' in node) {
            $('#input').hide();
            $('#choices').show();

            // Get the options' data
            var options = node["options"];

            // If there are options render them
            // Otherwise this is the end
            if (options.length > 0) {

                // Pause 750ms, then render options
                setTimeout(function() {

                    for (var i = 0; i < options.length; i++) {
                        var option = options[i];
                        var extraClass;
                        var clickFunction;

                        // Check option for a consequence
                        if (option['consequence'] === null) {

                            // The consequence is null meaning this is a branch we won't be exploring
                            // The button is given class 'disabled' and does nothing on click
                            clickFunction = null;
                            extraClass = "disabled";

                        } else {

                            // Else, click function (showResponse) is binded to it
                            clickFunction = function(option) {
                                showResponse(option);
                            }.bind(null, option);

                            extraClass = "";

                        }

                        // Render button
                        var button = $('<p/>', {
                            text: option['choice'],
                            "class": "chat-bubble user",
                            click: clickFunction
                        }).appendTo('#choices');
                    }

                }, 750);

            }

        /*
        ---------------
        If User Option is Input
        ---------------
        */
        } else if ('input' in node) {
            $('#input').show();
            $('#choices').hide();

            var option = node['input'];

            // TODO Can't we just template the form input & button?

            /*
            Render Input
            ---------------
            */

            // Create a form to hold our input and submit button
            var form = $('<form/>', {
                submit: checkInput.bind(null, option)
            });

            // Create a user bubble, append to form
            var inputBubble = $('<p/>', {
                "class": "chat-bubble user"
            }).appendTo(form);

            // Create an input, append to user bubble
            var input = $('<input/>', {
                type: 'text',
                placeholder: 'First Name',
                name: option['name']
            }).appendTo(inputBubble);

            // Create an input button, append to user bubble
            var button = $('<a/>', {
                text: 'Send',
                click: checkInput.bind(null, option)
            }).appendTo(inputBubble);

            // Append form to div#input
            form.appendTo('#input');

            // Focus on the input we just put into the DOM
            async.nextTick(function() {
                input.focus();
            });

        }

        scrollToBottom();
    });
}

/*
---------------
Render User Response
---------------
*/
function showResponse(option) {

    // If there was an input element, put that into the global context
    // This is dirty but this is a prototype.
    var feedback = "";

    if ('name' in option) {
        context[option['name']] = $('input[type=text]').val();

        feedback = context[option['name']];
    } else {
        feedback = option['choice'];
    }

    clearFooter();

    // Show what the user chose
    $("#chat-container").append('<p class="chat-bubble user">' + feedback + '</p>');

    if ('consequence' in option) {
        showStatement(option['consequence']);
    } else {
        // If the option doesn't have a consequence tag, it is a dead end
        // This can be intentional
    }
}