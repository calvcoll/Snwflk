var debug = true;
// Prevent caching if debugging
if (debug) $.ajaxSetup({ cache: false });
$(document.head).ready(function() {
    chrome.storage.sync.get("addons", function(data) {
        var addons = data.names;
        var addons_url = data.urls;
        if (addons != undefined) {
            addons.forEach(function(element, index){
                addon(addons_url[index], element, true);
            })
        }
    });
    chrome.storage.sync.get("style", function(data) { //gets sync data -> current button
        if (data.style.name != undefined && data.style.url != undefined) {
            changeStyle(data.style.url, data.style.name);
        }
    });
    injectFonts();
});

var toggle = undefined;
chrome.storage.sync.get("toggle", function(data) {toggle=data});
if (toggle === undefined || toggle === null) toggle = false;
var lastStyle = undefined;
chrome.storage.sync.get("style", function(style) {lastStyle = style});
if (lastStyle === undefined || toggle === null) {
  lastStyle = {
    url:"",
    name:""
  }
}

chrome.runtime.onMessage.addListener(
    function(message, sender, sendResponse) {
        if (message.url && message.name) {
            //console.log('recieved message (url): ' + message.url);
            changeStyle(message.url, message.name);
            sendResponse({});
        }
        else if (message.addon_url && message.addon_name && (message.addon_on != undefined)) {
            addon(message.addon_url, message.addon_name, message.addon_on);
            sendResponse({});
        }
        else if (message.toggle == true || message.toggle == false &&
            (message.toggle != undefined || message.toggle != null)) {
            console.log("message toggle " +  message.toggle);
            toggle = message.toggle;
            changeStyle(lastStyle.url, lastStyle.name);
        }
        else if (message.start) {
            if ($('.snwflk.style')[0] != undefined) {
                var classes = $('.snwflk.style')[0].className.split(/\s+/);
                //console.log(classes);
                sendResponse({button : classes[1]});
            } else {
                sendResponse(undefined);
            }
        }
    }
);

var fonts = [
    "//fonts.googleapis.com/css?family=Open+Sans"
];
var injectFonts = function() {
    fonts.forEach(function(font) {
        $.get(font, function(data){
            $(document.head).append("<style class=\"snwflkFont\">" + data + "</style>");
        });
    });
};

var addon = function(url, name, on) {
    if (on) {
      $.get(url).done(function (data) {
        var element = "<style class=\"snwflk addon " + name + "\">" + data + "</style>";
        $(document.head).append(element);
      });
    } else {
      var item = $('.snwflk.addon.' + name);
      console.log(item);
      if (item) {
          item.remove();
      }
    }
};

// Getting round CORS implementation + styling
var changeStyle = function(url, name) {
    if (!(url == "" || name == "")) {
        lastStyle = {url: url, name: name};
    }
    if (toggle) {
        $('link').each(function (index, element) {
            element = $(element);
            if (element.attr('rel') == "stylesheet" && element.attr('title')) {
                if ((name.indexOf('Light') > -1) || name.indexOf('Minima-White') > -1) {
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
                var current_style = '<style class="snwflk style">' + style + '</style>';
                $('.snwflk.style').remove();
                $('.snwflk.style').addClass(name);
                $(document.head).append(current_style);
            });
        } else {
            $('.snwflk.style').remove();
        }
    } else {
        $('.snwflk.style').remove();
    }
};
