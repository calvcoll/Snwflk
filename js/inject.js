//$(document.head).ready(function() {
//    $(document.head).append('<link rel="stylesheet" href="https://rawgit.com/calvcoll/rhodochronsite/master/rhodo.css" type="text/css" />');
//});

var current_style = '';

chrome.runtime.onMessage.addListener(
    function(message, sender, sendResponse) {
        //console.log("got message");
        //console.log(message);
        //console.log("sender: " + sender);
        if (message.url) {
            console.log('recieved message (url): ' + message.url);
            changeStyle(message.url);
            sendResponse({'':''});
        }
        //sendResponse({res : "f u"});
    }
);

// Getting round CORS implementation
var changeStyle = function(url) {
    $.get(url).done(function(data) {
        current_style = '<style class="snwflk">' + data + '</style>';
        $('.snwflk').remove();
        $(document.head).append(current_style);
    });
};