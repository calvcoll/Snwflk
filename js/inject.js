var current_style = '';

chrome.runtime.onMessage.addListener(
    function(message, sender, sendResponse) {
        if (message.url && message.name) {
            //console.log('recieved message (url): ' + message.url);
            changeStyle(message.url, message.name);
            sendResponse({'':''});
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

// Getting round CORS implementation
var changeStyle = function(url, name) {

    $('link').each(function(index, element) {
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
        $.get(url).done(function(data) {
            var style = data;
            if (style.indexOf('@-moz-document') > -1) { //to deal with "moz-document" to the start of a style
                var index = style.indexOf('{');
                style = style.substring(index + 1);
            }
            current_style = '<style class="snwflk">' + style + '</style>';
            $('.snwflk').remove();
            $(document.head).append(current_style);
            $('.snwflk').addClass(name)
        });
    } else {
        $('.snwflk').remove();
    }
};