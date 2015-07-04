var current_style = '';

chrome.runtime.onMessage.addListener(
    function(message, sender, sendResponse) {
        if (message.url) {
            //console.log('recieved message (url): ' + message.url);
            changeStyle(message.url, message.name);
            sendResponse({'':''});
        }
        else if (message.start) {
            if ($('.snwflk')[0] != undefined) {
                var classes = $('.snwflk')[0].className.split(/\s+/);
                console.log(classes);
                sendResponse({button : classes[1]});
            } else {
                sendResponse(undefined);
            }
        }
    }
);

// Getting round CORS implementation
var changeStyle = function(url, name) {
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