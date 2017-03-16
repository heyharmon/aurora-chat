/*
---------------
Conversation Data
---------------
*/
var conversationData = {
    "homepage": {
        1: {
            "statement": ["Welcome to Spirit of Alaska Credit Union, where we give award-winning service to interior Alaskans.", "My name is Aurora. I’m your new virtual assistant! What's your name?"],
            "input": {"name": "name", "consequence": 2}
        },
        2: {
            "statement": function(context) {
                return ["Hi " + context.name  + "! I'll do my best to help you around our website and share useful information.", "Click on &quot;Menu&quot; at the top-right of the screen to navigate the new website."];
            }
        }
    },
    "creditBuilder": {
        1: {
            "statement": ["What type of credit loan will meet your needs?"],
            "options": [{
                "choice": "I need to establish or rebuild my credit.",
                "consequence": 2
            },{
                "choice": "I need a low rate credit card.",
                "consequence": 3
            }]
        },
        2: {
            "statement": ["We can help with that. Do you have a co-signer available?"],
            "options": [{
                "choice": "Yes, I have a co-signer available.",
                "consequence": 2.1
            },{
                "choice": "No, I will be building credit on my own.",
                "consequence": 2.2
            }]
        },
        2.1: {
            "statement": ["It sounds like our Platinum card might meet your needs.", "Are you ready to apply?"],
            "options": [{
                "choice": "Yes, let's get started.",
                "consequence": 4.1
            },{
                "choice": "No, please contact me.",
                "consequence": 4.2
            }]
        },
        2.2: {
            "statement": ["We have a flexible Share Secured card product. Our loan officers can help you with your unique situation.", "Are you ready to apply?"],
            "options": [{
                "choice": "Yes, let's get started.",
                "consequence": 4.1
            },{
                "choice": "No, please contact me.",
                "consequence": 4.2
            }]
        },
        3: {
            "statement": ["It sounds like our Platinum card might meet your needs.", "Are you ready to apply?"],
            "options": [{
                "choice": "Yes, let's get started.",
                "consequence": 4.1
            },{
                "choice": "No, please contact me.",
                "consequence": 4.2
            }]
        },
        4.1: {
            "statement": ["<a target='_blank' href='https://google.com'>Click here</a> to start the application."]
        },
        4.2: {
            "statement": ["<a target='_blank' href='https://google.com'>Click here</a> to schedule your call with a friendly Spirit of Alaska loan officer"]
        }
    }
};