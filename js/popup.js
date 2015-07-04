var Button = React.createClass({displayName: "Button",
    onClick : function() {
        url = this.props.url;
        this.props.setCurrent(this.props.url);

        chrome.tabs.query({url: '*://tweetdeck.twitter.com/*'}, function(tabs) {
            tabs.forEach(function(tab) {
               chrome.tabs.sendMessage(tab.id, {'url' : url}, function(){
                   console.log("message sent:" + url);
               });
            });
        });
    },
   render: function() {
        return (
            React.createElement("button", {className: (this.props.current == this.props.url) ? "inUse" : "", onClick: this.onClick}, 
                this.props.name, 
                React.createElement("br", null)
            )
        );
    }
});
var Menu = React.createClass({displayName: "Menu",
   getInitialState: function() {
       return {
           online : false,
           option : "",
           current : ""
       }
   },
    setOnline: function() {
        this.setState({
            online: true
        });
    },
    componentDidMount: function() {
        $.get(chrome.extension.getURL("popup.html"), this.setOnline)
    },
    render: function() {
        var menu = this;
        var setCurrent = function(url) {
            menu.setState({current: url})
        };
        return (
            React.createElement("p", null, 
                React.createElement("div", {className: "online"}, " ", this.state.online ? 'online' : 'offline'), 
                React.createElement(Button, {url: "https://raw.githubusercontent.com/calvcoll/rhodochronsite/master/rhodo.css", name: "Rhodochronsite", current: this.state.current, setCurrent: setCurrent}), 
                React.createElement(Button, {url: "https://raw.githubusercontent.com/WinterReign/Snowflake/master/snowflake%20classic%20black.css", name: "Snwflk Classic Black", current: this.state.current, setCurrent: setCurrent})
            )
        );
    }
});
React.render(React.createElement(Menu, null), document.getElementById("menu"));