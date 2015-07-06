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
var Menu = React.createClass({displayName: "Menu",
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
        var menu = this;
        $.get(chrome.extension.getURL("popup.html"), function() {
            menu.setState({
                online: true
            });
        });
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
                    console.log("message sent:" + style_name + " " + style_url);
                });
            });
        });
    },
    render: function() {
        return (
            React.createElement("div", {className: "buttonContainer"}, 
                React.createElement("div", {className: "online"}, " ", this.state.online ? 'online' : 'offline'), 
                React.createElement(Button, {url: "https://raw.githubusercontent.com/calvcoll/rhodochronsite/master/rhodo.css", name: "Rhodochronsite", current: this.state.current, setCurrent: this.setCurrent}), 
                React.createElement(Button, {url: "https://raw.githubusercontent.com/WinterReign/Snowflake/master/snowflake%20classic%20black.css", name: "Snowflake-Classic-Black", current: this.state.current, setCurrent: this.setCurrent}), 
                React.createElement(Button, {url: "https://raw.githubusercontent.com/WinterReign/Snowflake/master/snowflake%20classic%20light.css", name: "Snowflake-Classic-Light", current: this.state.current, setCurrent: this.setCurrent}), 
                React.createElement(Button, {url: "https://raw.githubusercontent.com/FractalHexagon/Snowflake/master/snowflake%20minima%20black%20aero.css", name: "Snowflake-Minima-Black-Aero", current: this.state.current, setCurrent: this.setCurrent})
            )
        );
    }
});
var NavBar = React.createClass({displayName: "NavBar",
    render: function () {
        var renderElements = [];
        var navbar = this;
        this.props.menus.forEach(function(menu) {
            if (menu.props.id == navbar.props.default_id) {
                renderElements.push(React.createElement("li", {className: "selected"}, React.createElement("a", {href: "#"+ menu.props.id}, menu.props.human_id)));
            }
            else {
                renderElements.push(React.createElement("li", null, React.createElement("a", {href: "#"+ menu.props.id}, menu.props.id)));
            }
        });
        return (
            React.createElement("div", {className: "navigation"}, 
                React.createElement("div", {className: "logo"}, 
                    React.createElement("img", {class: "logo", src: "img/snowflake_logo-48.png", alt: "snowflake-logo"}), 
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
        var view = this;
        this.props.menus.forEach(function(menu) {
            if (menu.props.id == view.props.default_id) {
                renderElements.push(React.createElement("div", {id: menu.props.id, className: "selected"}, React.createElement("h1", null, menu.props.human_id), React.createElement("hr", null), menu));
            }
            else {
                renderElements.push(React.createElement("div", {id: menu.props.id}, menu));
            }
        });
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
            default_id : "styleSwitcher", // may cause problems in the future. (overwriting shit)
            menus : [
                React.createElement(Menu, {id: "styleSwitcher", human_id: "Styles"})
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