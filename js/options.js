"use strict";

var Button = React.createClass({
    displayName: "Button",

    onClick: function onClick() {
        var inUse = this.props.current == this.props.name;
        if (!inUse) {
            this.props.setCurrent(this.props.name, this.props.url);
        } else {
            this.props.setCurrent("none", "none");
        }
    },
    render: function render() {
        var rendername = this.props.name;
        if (rendername.indexOf('-') > -1) {
            rendername = rendername.split('-').join(' ');
        }
        return React.createElement(
            "button",
            { className: "chrome-bootstrap", onClick: this.onClick },
            rendername,
            " ",
            +(this.props.current == this.props.name) ? " ✓" : ""
        );
    }
});
var ToggleButton = React.createClass({
    displayName: "ToggleButton",

    getInitialState: function getInitialState() {
        chrome.storage.sync.get("addons", function (data) {
            if (data.addons != undefined) {
                if (data.addons.names != undefined) {
                    var index = data.addons.names.indexOf(this.props.name);
                    if (index >= 0) {
                        this.setState({ on: true });
                    }
                }
            }
        }.bind(this));
        return {
            on: false
        };
    },
    onClick: function onClick() {
        var oldState = this.state.on;
        var url = this.props.url;
        var name = this.props.name;
        this.setState({ on: !oldState });
        var in_list = false;
        var list = [];
        var url_list = [];
        var list_index = -1;
        chrome.storage.sync.get("addons", function (data) {
            //active
            if (data.addons != undefined) {
                list = data.addons.names;
                url_list = data.addons.urls;
            } else {
                list = undefined;
                url_list = undefined;
            }
            if (list != undefined) {
                var index = list.indexOf(this.props.name);
                if (index >= 0) {
                    in_list = true;
                    list_index = index;
                }
            }
            // placed in here so it gets vals
            list = list == undefined ? [] : list;
            url_list = url_list == undefined ? [] : url_list;
            var new_list = list;
            var new_url_list = url_list;
            if (oldState && in_list) {
                //was on - now off  and in list = remove it
                var index = list.indexOf(this.props.name);
                if (index >= 0) {
                    list.splice(index, 1);
                    url_list.splice(index, 1);
                }
            } else if (!oldState && !in_list) {
                //was off and is now on, and not in list
                list.push(this.props.name);
                url_list.push(this.props.url);
            }
            chrome.storage.sync.set({
                addons: {
                    names: list,
                    urls: url_list
                }
            });
            chrome.tabs.query({ url: '*://tweetdeck.twitter.com/*' }, function (tabs) {
                tabs.forEach(function (tab) {
                    chrome.tabs.sendMessage(tab.id, {
                        addon_url: url,
                        addon_name: name,
                        addon_on: !oldState
                    }, function () {
                        //console.log("message sent:" + !oldState + " " + name + " " + url);
                    });
                });
            });
        }.bind(this));
    },
    render: function render() {
        var renderName = this.props.name;
        if (renderName.indexOf('-') > -1) {
            renderName = renderName.split('-').join(' ');
        }
        return React.createElement(
            "button",
            { className: "chrome-bootstrap toggle", onClick: this.onClick },
            renderName,
            " ",
            +this.state.on ? " ✓" : ""
        );
    }
});
var StyleMenu = React.createClass({
    displayName: "StyleMenu",

    getInitialState: function getInitialState() {
        var menu = this;
        var current = "";
        chrome.storage.sync.get("style", function (data) {
            //gets sync data -> current button
            if (data.style != undefined) {
                if (data.style.name != undefined && data.style.url != undefined) {
                    current = data.style.name;
                    menu.setCurrent(data.style.name, data.style.url);
                }
            }
        });
        return {
            online: false,
            option: "",
            current: current,
            buttons: menu.getButtons()
        };
    },
    componentDidMount: function componentDidMount() {
        //$.get(chrome.extension.getURL("popup.html"), function() {
        $.get('https://raw.githubusercontent.com/calvcoll/rhodochronsite/master/rhodo.css', function () {
            // using rhodo as is hosted on github (won't re-direct)
            this.setState({
                online: true
            });
        }.bind(this));
    },
    setCurrent: function setCurrent(style_name, style_url) {
        this.setState({ current: style_name });
        chrome.storage.sync.set({
            style: {
                name: style_name,
                url: style_url
            }
        });

        chrome.tabs.query({ url: '*://tweetdeck.twitter.com/*' }, function (tabs) {
            tabs.forEach(function (tab) {
                chrome.tabs.sendMessage(tab.id, {
                    url: style_url,
                    name: style_name
                }, function () {
                    //console.log("message sent:" + style_name + " " + style_url);
                });
            });
        });
    },
    getButtons: function getButtons() {
        var buttons = [];
        buttons.push({ id: 0, url: "https://raw.githubusercontent.com/calvcoll/rhodochronsite/master/rhodo.css", name: "Rhodochronsite" });
        buttons.push({ id: buttons.length, url: "https://raw.githubusercontent.com/fracthex/snwflk/master/snwflk%20classic%20black.css", name: "Snwflk-Classic-Black" });
        buttons.push({ id: buttons.length, url: "https://raw.githubusercontent.com/fracthex/snwflk/master/snwflk%20classic%20light.css", name: "Snwflk-Classic-Light" });
        buttons.push({ id: buttons.length, url: "https://raw.githubusercontent.com/fracthex/snwflk/master/snwflk%20neon.css", name: "Snwflk-Neon" });
        buttons.push({ id: buttons.length, url: "https://raw.githubusercontent.com/fracthex/snwflk/master/snwflk%20lucent%20blizzard.css", name: "Snowflake-Lucent-Blizzard" });
        buttons.push({ id: buttons.length, url: "https://raw.githubusercontent.com/fracthex/snwflk/master/snwflk%20twilight%20aero.css", name: "Snowflake-Twilight-Aero" });
        buttons.push({ id: buttons.length, url: "https://raw.githubusercontent.com/fracthex/snwflk/master/snwflk%20twilight%20aqua.css", name: "Snowflake-Twilight-Aqua" });
        return buttons;
    },
    render: function render() {
        var _this = this;

        return React.createElement(
            "div",
            { className: "buttonContainer" },
            React.createElement(
                "div",
                { className: "online" },
                " Online: ",
                React.createElement("div", { className: "online-icon " + (this.state.online ? 'online' : 'offline') })
            ),
            this.state.buttons.map(function (button) {
                return React.createElement(Button, { key: button.id, url: button.url, name: button.name, current: _this.state.current, setCurrent: _this.setCurrent });
            }),
            React.createElement(
                "h1",
                null,
                "Add-ons"
            ),
            React.createElement("hr", null),
            React.createElement(ToggleButton, { url: "https://gist.githubusercontent.com/pixeldesu/1afcc9d3978d04bd3646/raw/9130ecd344a66b24009e915b8b74e9876e70b919/direct-message.scss", name: "Direct-Message-Hiding" }),
            React.createElement(ToggleButton, { url: "https://raw.githubusercontent.com/pixeldesu/visuals/master/tweetdeck/stars/stars.css", name: "Force-Old-Stars" }),
            React.createElement(ToggleButton, { url: "https://raw.githubusercontent.com/fracthex/snwflk/master/force-normal-case.css", name: "Force-Default-Case" })
        );
    }
});
var ScriptMenu = React.createClass({
    displayName: "ScriptMenu",

    render: function render() {
        return React.createElement(
            "div",
            null,
            "It works!"
        );
    }
});
var NavBar = React.createClass({
    displayName: "NavBar",

    render: function render() {
        var renderElements = [];
        this.props.menus.forEach(function (menu) {
            if (menu.props.id == this.props.default_id) {
                renderElements.push(React.createElement(
                    "li",
                    { key: menu.props.id, className: "selected" },
                    React.createElement(
                        "a",
                        { href: "#" + menu.props.id },
                        menu.props.human_id
                    )
                ));
            } else {
                renderElements.push(React.createElement(
                    "li",
                    { key: menu.props.id },
                    React.createElement(
                        "a",
                        { href: "#" + menu.props.id },
                        menu.props.human_id
                    )
                ));
            }
        }.bind(this));
        return React.createElement(
            "div",
            { className: "navigation" },
            React.createElement(
                "div",
                { className: "logo" },
                React.createElement("img", { className: "logo", src: "img/snowflake_logo-48.png", alt: "snowflake-logo" }),
                React.createElement(
                    "h2",
                    null,
                    "Snwflk"
                )
            ),
            React.createElement(
                "ul",
                { className: "menu" },
                renderElements
            )
        );
    }
});
var MainView = React.createClass({
    displayName: "MainView",

    render: function render() {
        var renderElements = [];
        this.props.menus.forEach(function (menu) {
            if (menu.props.id == this.props.default_id) {
                renderElements.push(React.createElement(
                    "div",
                    { key: menu.props.id, id: menu.props.id, className: "selected" },
                    React.createElement(
                        "h1",
                        null,
                        menu.props.human_id
                    ),
                    React.createElement("hr", null),
                    menu
                ));
            } else {
                renderElements.push(React.createElement(
                    "div",
                    { key: menu.props.id, id: menu.props.id },
                    React.createElement(
                        "h1",
                        null,
                        menu.props.human_id
                    ),
                    React.createElement("hr", null),
                    menu
                ));
            }
        }.bind(this));
        return React.createElement(
            "div",
            { className: "mainview view" },
            renderElements
        );
    }
});
var Frame = React.createClass({
    displayName: "Frame",

    getInitialState: function getInitialState() {
        return {
            default_id: "styleSwitcher",
            menus: [React.createElement(StyleMenu, { id: "styleSwitcher", human_id: "Styles" }), React.createElement(ScriptMenu, { id: "jsMenu", human_id: "Javascript" })]
        };
    },
    render: function render() {
        return React.createElement(
            "div",
            { className: "frame" },
            React.createElement(NavBar, { menus: this.state.menus, default_id: this.state.default_id }),
            React.createElement(MainView, { menus: this.state.menus, default_id: this.state.default_id })
        );
    }
});
React.render(React.createElement(Frame, null), document.body);