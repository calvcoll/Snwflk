var Button = React.createClass({displayName: "Button",
    onClick : function() {
        var inUse = this.props.current == this.props.name;
        if (!inUse) {
            this.props.setCurrent(this.props.name, this.props.url);
        } else {
            this.props.setCurrent("none", "none");
        }
    },
   render: function() {
       var rendername = this.props.name;
       if (this.props.name.indexOf('-')>-1) {
           rendername = this.props.name.split('-').join(' ');
       }
        return (
            React.createElement("button", {className: "chrome-bootstrap", onClick: this.onClick}, 
                rendername, " ",  + (this.props.current == this.props.name) ? " ✓" : ""
            )
        );
    }
});
var StyleMenu = React.createClass({displayName: "StyleMenu",
    getInitialState: function() {
        var menu = this;
        var current = "";
        chrome.storage.sync.get(null, function(data) { //gets sync data -> current button
            if (data.name != undefined && data.url != undefined) {
                menu.setCurrent(data.name, data.url);
            }
        });
        return {
            online : false,
            option : "",
            current : current
        }
    },
    componentDidMount: function() {
        //$.get(chrome.extension.getURL("popup.html"), function() {
        $.get('https://raw.githubusercontent.com/calvcoll/rhodochronsite/master/rhodo.css', function() { // using rhodo as is hosted on github (won't re-direct)
            this.setState({
                online: true
            });
        }.bind(this));
    },
    setCurrent: function(style_name,style_url) {
        this.setState({current: style_name});
        chrome.storage.sync.set({
            name : style_name,
            url : style_url
        });

        chrome.tabs.query({url: '*://tweetdeck.twitter.com/*'}, function(tabs) {
            tabs.forEach(function(tab) {
                chrome.tabs.sendMessage(tab.id, {
                    url : style_url,
                    name : style_name
                }, function(){
                    //console.log("message sent:" + style_name + " " + style_url);
                });
            });
        });
    },
    render: function() {
        return (
            React.createElement("div", {className: "buttonContainer"}, 
                React.createElement("div", {className: "online"}, " Online: ", React.createElement("div", {className: "online-icon " + (this.state.online ? 'online' : 'offline')})), 
                React.createElement(Button, {url: "https://raw.githubusercontent.com/calvcoll/rhodochronsite/master/rhodo.css", name: "Rhodochronsite", current: this.state.current, setCurrent: this.setCurrent}), 
                React.createElement(Button, {url: "https://raw.githubusercontent.com/WinterReign/Snowflake/master/snowflake%20classic%20black.css", name: "Snowflake-Classic-Black", current: this.state.current, setCurrent: this.setCurrent}), 
                React.createElement(Button, {url: "https://raw.githubusercontent.com/WinterReign/Snowflake/master/snowflake%20classic%20light.css", name: "Snowflake-Classic-Light", current: this.state.current, setCurrent: this.setCurrent}), 
                React.createElement(Button, {url: "https://github.com/pixeldesu/technicolour/releases/download/v3.0.0/technicolour-dark.css", name: "Technicolour", current: this.state.current, setCurrent: this.setCurrent}), 
                React.createElement(Button, {url: "https://raw.githubusercontent.com/FractalHexagon/Snowflake/master/snowflake%20minima%20black%20aero.css", name: "Snowflake-Minima-Black-Aero", current: this.state.current, setCurrent: this.setCurrent})
            )
        );
    }
});
var ScriptMenu = React.createClass({displayName: "ScriptMenu",
    render: function() {
        return (
            React.createElement("div", null, 
                "It works!"
            )
        )
    }
});
var NavBar = React.createClass({displayName: "NavBar",
    render: function () {
        var renderElements = [];
        this.props.menus.forEach(function(menu) {
            if (menu.props.id == this.props.default_id) {
                renderElements.push(React.createElement("li", {key: menu.props.id, className: "selected"}, React.createElement("a", {href: "#"+ menu.props.id}, menu.props.human_id)));
            }
            else {
                renderElements.push(React.createElement("li", {key: menu.props.id}, React.createElement("a", {href: "#"+ menu.props.id}, menu.props.human_id)));
            }
        }.bind(this));
        return (
            React.createElement("div", {className: "navigation"}, 
                React.createElement("div", {className: "logo"}, 
                    React.createElement("img", {className: "logo", src: "img/snowflake_logo-48.png", alt: "snowflake-logo"}), 
                    React.createElement("h2", null, "Snwflk")
                ), 
                React.createElement("ul", {className: "menu"}, 
                    renderElements
                )
            )
        )
    }
});
var MainView = React.createClass({displayName: "MainView",
    render: function() {
        var renderElements = [];
        this.props.menus.forEach(function(menu) {
            if (menu.props.id == this.props.default_id) {
                renderElements.push(React.createElement("div", {key: menu.props.id, id: menu.props.id, className: "selected"}, React.createElement("h1", null, menu.props.human_id), React.createElement("hr", null), menu));
            }
            else {
                renderElements.push(React.createElement("div", {key: menu.props.id, id: menu.props.id}, React.createElement("h1", null, menu.props.human_id), React.createElement("hr", null), menu));
            }
        }.bind(this));
        return (
            React.createElement("div", {className: "mainview view"}, 
                renderElements
            )
        )
    }
});
var Frame = React.createClass({displayName: "Frame",
    getInitialState: function() {
        return {
            default_id : "styleSwitcher",
            menus : [
                React.createElement(StyleMenu, {id: "styleSwitcher", human_id: "Styles"}),
                React.createElement(ScriptMenu, {id: "jsMenu", human_id: "Javascript"})
            ]
        }
    },
    render: function() {
        return (
            React.createElement("div", {className: "frame"}, 
            React.createElement(NavBar, {menus: this.state.menus, default_id: this.state.default_id}), 
            React.createElement(MainView, {menus: this.state.menus, default_id: this.state.default_id})
            )
        )
    }
});
React.render(React.createElement(Frame, null), document.body);