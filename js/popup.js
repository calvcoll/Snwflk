var Button = React.createClass({displayName: "Button",
    onClick : function() {
        var url = this.props.url;
        var name = this.props.name;
        var inUse = this.props.current == this.props.name;
        if (!inUse) {
            this.props.setCurrent(this.props.name);
        } else {
            this.props.setCurrent("none");
            name = "none";
            url = "none";
        }

        chrome.tabs.query({url: '*://tweetdeck.twitter.com/*'}, function(tabs) {
            tabs.forEach(function(tab) {
               chrome.tabs.sendMessage(tab.id, {
                   url : url,
                   name : name
               }, function(){
                   console.log("message sent:" + name);
               });
            });
        });
    },
   render: function() {
       var rendername = this.props.name;
       if (this.props.name.indexOf('-')>-1) {
           rendername = this.props.name.split('-').join(' ');
       }
        return (
            React.createElement("button", {className: (this.props.current == this.props.name) ? "inUse" : "", onClick: this.onClick}, 
                rendername, 
                React.createElement("br", null)
            )
        );
    }
});
var Menu = React.createClass({displayName: "Menu",
   getInitialState: function() {
       var menu = this;
       chrome.tabs.query({url: '*://tweetdeck.twitter.com/*'}, function(tabs) {
           tabs.forEach(function(tab) {
               chrome.tabs.sendMessage(tab.id, {start:true}, function(response){
                   console.log("message sent: looking for a button ");
                   console.log(response);
                   if (response != undefined) {
                       console.log('button got');
                       menu.setCurrent(response.button);
                   }
                   else {
                       menu.setCurrent(response.button);
                   }
               });
           });
       });
       return {
           online : false,
           option : "",
           current : ""
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
    setCurrent: function(name) {
        this.setState({current: name})
    },
    render: function() {
        return (
            React.createElement("p", null, 
                React.createElement("div", {className: "online"}, " ", this.state.online ? 'online' : 'offline'), 
                React.createElement(Button, {url: "https://raw.githubusercontent.com/calvcoll/rhodochronsite/master/rhodo.css", name: "Rhodochronsite", current: this.state.current, setCurrent: this.setCurrent}), 
                React.createElement(Button, {url: "https://raw.githubusercontent.com/WinterReign/Snowflake/master/snowflake%20classic%20black.css", name: "Snowflake-Classic-Black", current: this.state.current, setCurrent: this.setCurrent})
            )
        );
    }
});
React.render(React.createElement(Menu, null), document.getElementById("menu"));