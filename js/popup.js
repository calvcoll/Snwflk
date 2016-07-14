"use strict";

var Button = React.createClass({
    displayName: "Button",

    getInitialState: function getInitialState() {
        chrome.storage.sync.get('toggle', function (data) {
            //gets sync data -> current button
            if ((data.toggle == true || data.toggle == false) && (data.toggle != undefined || data.toggle != null)) {
                this.setState({ on: data.toggle }); // I have no idea why it has to be opposite but I'm not moaning.
            }
        }.bind(this));
        return {
            on: true
        };
    },
    iconToggle: function iconToggle() {
        var icon = !this.state.on ? "img/snowflake_logo-48.png" : "img/snowflake_logo-48-disabled.png";
        chrome.browserAction.setIcon({ path: icon });

        $('#logo').attr("src", icon);
    },
    toggle: function toggle() {
        this.setState({ on: !this.state.on });
        chrome.storage.sync.set({ toggle: !this.state.on });
        this.iconToggle();
    },
    onClick: function onClick() {
        this.toggle();
        chrome.tabs.query({ url: '*://tweetdeck.twitter.com/*' }, function (tabs) {
            tabs.forEach(function (tab) {
                chrome.tabs.sendMessage(tab.id, {
                    toggle: this.state.on
                }, function () {
                    console.log("message sent: toggle");
                });
            });
        }.bind(this));
    },
    render: function render() {
        return React.createElement(
            "button",
            { onClick: this.onClick, className: this.state.on ? "inUse" : "" },
            this.props.name,
            React.createElement("br", null)
        );
    }
});
var Menu = React.createClass({
    displayName: "Menu",

    getInitialState: function getInitialState() {
        var current = "";
        return {
            online: false,
            option: "",
            current: current
        };
    },
    componentDidMount: function componentDidMount() {
        $.get(chrome.extension.getURL("popup.html"), function () {
            this.setState({
                online: true
            });
        }.bind(this));
    },
    render: function render() {
        return React.createElement(
            "p",
            null,
            React.createElement(Button, { name: "Toggle" })
        );
    }
});
React.render(React.createElement(Menu, null), document.getElementById("menu"));