$(document.head).ready(function() {
    chrome.storage.sync.get(null, function(data) { //gets sync data -> current button
        if (data.name != undefined && data.url != undefined) {
            changeStyle(data.url, data.name);
        }
    });
    injectFonts();
});

var toggle = true;
var lastStyle = {
    url: "",
    name: ""
};

chrome.runtime.onMessage.addListener(
    function(message, sender, sendResponse) {
        if (message.url && message.name) {
            //console.log('recieved message (url): ' + message.url);
            changeStyle(message.url, message.name);
            sendResponse({'':''});
        }
        else if (message.toggle == true || message.toggle == false &&
            (message.toggle != undefined || message.toggle != null)) {
            console.log("message toggle " +  message.toggle);
            toggle = message.toggle;
            changeStyle(lastStyle.url, lastStyle.name);
        }
        else if (message.start) {
            if ($('.snwflk')[0] != undefined) {
                var classes = $('.snwflk')[0].className.split(/\s+/);
                //console.log(classes);
                sendResponse({button : classes[1]});
            } else {
                sendResponse(undefined);
            }
        }
    }
);

var fonts = [
    '//fonts.googleapis.com/css?family=Open+Sans'
];
var injectFonts = function() {
    fonts.forEach(function(font) {
        $.get(font, function(data){
            $(document.head).append("<style class=\"SnwflkFont\">" + data + "</style>");
        });
    });
};

// Getting round CORS implementation
var changeStyle = function(url, name) {
    if (!(url == "" || name == "")) {
        lastStyle = {url: url, name: name};
    }
    if (toggle) {
        $('link').each(function (index, element) {
            element = $(element);
            if (element.attr('rel') == "stylesheet" && element.attr('title')) {
                if (name.indexOf('Light') > -1) {
                    if (element.attr('title') == "dark") {
                        element.prop('disabled', true);
                    } else {
                        element.prop('disabled', false);
                    }
                }
                else {
                    if (element.attr('title') == "dark") {
                        element.prop('disabled', false);
                    } else {
                        element.prop('disabled', true);
                    }
                }
            }
        });
        if (!(name == "none" || url == "none")) {
            $.get(url).done(function (data) {
                var style = data;
                if (style.indexOf('@-moz-document') > -1) { //to deal with "moz-document" to the start of a style
                    var index = style.indexOf('{');
                    style = style.substring(index + 1);
                }
                var current_style = '<style class="snwflk">' + style + '</style>';
                $('.snwflk').remove();
                $(document.head).append(current_style);
                $('.snwflk').addClass(name)
            });
        } else {
            $('.snwflk').remove();
        }
    } else {
        $('.snwflk').remove();
    }
};