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
       if (rendername.indexOf('-')>-1) {
           rendername = rendername.split('-').join(' ');
       }
        return (
            React.createElement("button", {className: "chrome-bootstrap", onClick: this.onClick}, 
                rendername, " ",  + (this.props.current == this.props.name) ? " ✓" : ""
            )
        );
    }
});
var ToggleButton = React.createClass({displayName: "ToggleButton",
    getInitialState: function() {
        chrome.storage.sync.get(null, function(data) {
            if (data.current_add_on != undefined) {
                var index = data.current_add_on.indexOf(this.props.name);
                if (index >= 0) {
                    this.setState({on : true});
                }
            }
        }.bind(this));
        return {
            on : false
        }
    },
    onClick: function() {
        var oldState = this.state.on;
        var url = this.props.url;
        var name = this.props.name;
        this.setState({ on : !oldState });
        var in_list = false;
        var list = [];
        var url_list = [];
        chrome.storage.sync.get(null, function(data) { //active
            list = data.current_add_on;
            url_list = data.current_add_on_url;
            if (list != undefined) {
                var index = list.indexOf(this.props.name);
                if (index >= 0) {
                    in_list = true;
                }
            }
        }.bind(this));
        list = list == undefined ? [] : list;
        url_list = url_list == undefined ? [] : url_list;
        var new_list = list;
        var new_url_list = url_list;
        if (oldState && in_list) { //no oldState && !inList as no change needed
            var index = list.indexOf(this.props.name);
            if (index >= 0) {
                new_list = list.splice(index, 1);
                new_url_list = url_list.splice(index, 1);
            }
        } else if (!oldState && !in_list) { //no !oldstate && in_list as addon is needed
            new_list.push(this.props.name);
            new_url_list.push(this.props.url);
        }
        chrome.storage.sync.set({
            current_add_on : new_list,
            current_add_on_url : new_url_list
        });
        chrome.tabs.query({url: '*://tweetdeck.twitter.com/*'}, function(tabs) {
            tabs.forEach(function(tab) {
                chrome.tabs.sendMessage(tab.id, {
                    addon_url : url,
                    addon_name : name,
                    addon_on : !oldState
                }, function(){
                    //console.log("message sent:" + !oldState + " " + name + " " + url);
                });
            });
        });
    },
    render: function() {
        var renderName = this.props.name;
        if (renderName.indexOf('-')>-1) {
            renderName = renderName.split('-').join(' ');
        }
        return (
            React.createElement("button", {className: "chrome-bootstrap toggle", onClick: this.onClick}, 
                renderName, " ",  + (this.state.on) ? " ✓" : ""
            )
        )
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
                React.createElement(Button, {url: "https://raw.githubusercontent.com/WinterReign/Snowflake/master/snowflake%20minima%20synth.css", name: "Snowflake-Minima-Synth", current: this.state.current, setCurrent: this.setCurrent}), 
                React.createElement(Button, {url: "https://raw.githubusercontent.com/WinterReign/Snowflake/master/snowflake%20classic%20black.css", name: "Snowflake-Classic-Black", current: this.state.current, setCurrent: this.setCurrent}), 
                React.createElement(Button, {url: "https://raw.githubusercontent.com/WinterReign/Snowflake/master/snowflake%20classic%20light.css", name: "Snowflake-Classic-Light", current: this.state.current, setCurrent: this.setCurrent}), 
                React.createElement(Button, {url: "https://raw.githubusercontent.com/FractalHexagon/Snowflake/master/snowflake%20minima%20black%20aero.css", name: "Snowflake-Minima-Black-Aero", current: this.state.current, setCurrent: this.setCurrent}), 
                React.createElement(Button, {url: "https://raw.githubusercontent.com/FractalHexagon/Snowflake/master/snowflake%20minima%20white%20aqua.css", name: "Snowflake-Minima-White-Aqua", current: this.state.current, setCurrent: this.setCurrent}), 
                React.createElement(Button, {url: "https://raw.githubusercontent.com/FractalHexagon/Snowflake/minima_white_rewrite/snowflake%20minima%20white%20aqua.css", name: "Snowflake-Minima-White-Aqua-Rewrite-Branch", current: this.state.current, setCurrent: this.setCurrent}), 
                React.createElement("h1", null, "Add-ons"), React.createElement("hr", null), 
                React.createElement(ToggleButton, {url: "https://gist.githubusercontent.com/pixeldesu/1afcc9d3978d04bd3646/raw/9130ecd344a66b24009e915b8b74e9876e70b919/direct-message.scss", name: "Direct-Message-Hiding"}), 
                React.createElement(ToggleButton, {url: "https://raw.githubusercontent.com/FractalHexagon/Snowflake/minima_white_rewrite/force-normal-case.css", name: "Force-Default-Case"})
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
