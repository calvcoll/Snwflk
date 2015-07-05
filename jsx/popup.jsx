var Button = React.createClass({
    getInitialState: function() {
        var button = this;
        chrome.storage.sync.get('toggle', function(data) { //gets sync data -> current button
            if ((data.toggle == true || data.toggle == false) &&
            (data.toggle != undefined || data.toggle != null)) {
                button.setState({on: data.toggle}); // I have no idea why it has to be opposite but I'm not moaning.
            }
        });
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
        var button = this;
        chrome.tabs.query({url: '*://tweetdeck.twitter.com/*'}, function(tabs) {
            tabs.forEach(function(tab) {
                chrome.tabs.sendMessage(tab.id, {
                    toggle : button.state.on
                }, function(){
                    console.log("message sent: toggle");
                });
            });
        });
    },
   render: function() {
        return (
            <button onClick={this.onClick} className={(this.state.on) ? "inUse" : ""}>
                {this.props.name}
                <br />
            </button>
        );
    }
});
var Menu = React.createClass({
   getInitialState: function() {
       var menu = this;
       var current = "";
       return {
           online : false,
           option : "",
           current : current
       }
   },
    componentDidMount: function() {
        menu = this;
        $.get(chrome.extension.getURL("popup.html"), function() {
            menu.setState({
                online: true
            });
        });
    },
    render: function() {
        return (
            <p>
                <Button name="Toggle"/>
            </p>
        );
    }
});
React.render(<Menu />, document.getElementById("menu"));