var Button = React.createClass({displayName: "Button",
    getInitialState: function() {
        chrome.storage.sync.get('toggle', function(data) { //gets sync data -> current button
            if ((data.toggle == true || data.toggle == false) &&
            (data.toggle != undefined || data.toggle != null)) {
                this.setState({on: data.toggle}); // I have no idea why it has to be opposite but I'm not moaning.
            }
        }.bind(this));
        return {
            on: true
        }
    },
    iconToggle: function () {
        var icon = !this.state.on ? "img/snowflake_logo-48.png" : "img/snowflake_logo-48-disabled.png";
        chrome.browserAction.setIcon({path: icon});

        $('#logo').attr("src", icon);
    },
    toggle: function() {
        this.setState({on: !this.state.on});
        chrome.storage.sync.set({toggle: !this.state.on});
        this.iconToggle();
    },
    onClick: function() {
        this.toggle();
        chrome.tabs.query({url: '*://tweetdeck.twitter.com/*'}, function(tabs) {
            tabs.forEach(function(tab) {
                chrome.tabs.sendMessage(tab.id, {
                    toggle : button.state.on
                }, function(){
                    console.log("message sent: toggle");
                });
            });
        }.bind(this));
    },
   render: function() {
        return (
            React.createElement("button", {onClick: this.onClick, className: (this.state.on) ? "inUse" : ""}, 
                this.props.name, 
                React.createElement("br", null)
            )
        );
    }
});
var Menu = React.createClass({displayName: "Menu",
   getInitialState: function() {
       var current = "";
       return {
           online : false,
           option : "",
           current : current
       }
   },
    componentDidMount: function() {
        $.get(chrome.extension.getURL("popup.html"), function() {
            this.setState({
                online: true
            });
        }.bind(this));
    },
    render: function() {
        return (
            React.createElement("p", null, 
                React.createElement(Button, {name: "Toggle"})
            )
        );
    }
});
React.render(React.createElement(Menu, null), document.getElementById("menu"));