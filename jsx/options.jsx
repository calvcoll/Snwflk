var Button = React.createClass({
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
            <button className="chrome-bootstrap" onClick={this.onClick}>
                {rendername} { + (this.props.current == this.props.name) ? " ✓" : ""}
            </button>
        );
    }
});
var ToggleButton = React.createClass({
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
            <button className="chrome-bootstrap toggle" onClick={this.onClick}>
                {renderName} { + (this.state.on) ? " ✓" : ""}
            </button>
        )
    }
});
var StyleMenu = React.createClass({
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
            <div className="buttonContainer">
                <div className="online"> Online: <div className={"online-icon " + (this.state.online ? 'online' : 'offline')}/></div>
                <Button url="https://raw.githubusercontent.com/calvcoll/rhodochronsite/master/rhodo.css" name="Rhodochronsite" current={this.state.current} setCurrent={this.setCurrent}/>
                <Button url="https://raw.githubusercontent.com/WinterReign/Snowflake/master/snowflake%20minima%20synth.css" name="Snowflake-Minima-Synth" current={this.state.current} setCurrent={this.setCurrent}/>
                <Button url="https://raw.githubusercontent.com/WinterReign/Snowflake/master/snowflake%20classic%20black.css" name="Snowflake-Classic-Black" current={this.state.current} setCurrent={this.setCurrent}/>
                <Button url="https://raw.githubusercontent.com/WinterReign/Snowflake/master/snowflake%20classic%20light.css" name="Snowflake-Classic-Light" current={this.state.current} setCurrent={this.setCurrent}/>
                <Button url="https://raw.githubusercontent.com/FractalHexagon/Snowflake/master/snowflake%20minima%20black%20aero.css" name="Snowflake-Minima-Black-Aero" current={this.state.current} setCurrent={this.setCurrent}/>
                <Button url="https://raw.githubusercontent.com/FractalHexagon/Snowflake/master/snowflake%20minima%20white%20aqua.css" name="Snowflake-Minima-White-Aqua" current={this.state.current} setCurrent={this.setCurrent}/>
                <Button url="https://raw.githubusercontent.com/FractalHexagon/Snowflake/minima_white_rewrite/snowflake%20minima%20white%20aqua.css" name="Snowflake-Minima-White-Aqua-Rewrite-Branch" current={this.state.current} setCurrent={this.setCurrent}/>
                <h1>Add-ons</h1><hr />
                <ToggleButton url="https://gist.githubusercontent.com/pixeldesu/1afcc9d3978d04bd3646/raw/9130ecd344a66b24009e915b8b74e9876e70b919/direct-message.scss" name="Direct-Message-Hiding"/>
                <ToggleButton url="https://raw.githubusercontent.com/FractalHexagon/Snowflake/minima_white_rewrite/force-normal-case.css" name="Force-Default-Case"/>
            </div>
        );
    }
});
var ScriptMenu = React.createClass({
    render: function() {
        return (
            <div>
                It works!
            </div>
        )
    }
});
var NavBar = React.createClass({
    render: function () {
        var renderElements = [];
        this.props.menus.forEach(function(menu) {
            if (menu.props.id == this.props.default_id) {
                renderElements.push(<li key={menu.props.id} className="selected"><a href={"#"+ menu.props.id}>{menu.props.human_id}</a></li>);
            }
            else {
                renderElements.push(<li key={menu.props.id}><a href={"#"+ menu.props.id}>{menu.props.human_id}</a></li>);
            }
        }.bind(this));
        return (
            <div className="navigation">
                <div className="logo">
                    <img className="logo" src="img/snowflake_logo-48.png" alt="snowflake-logo"></img>
                    <h2>Snwflk</h2>
                </div>
                <ul className="menu">
                    {renderElements}
                </ul>
            </div>
        )
    }
});
var MainView = React.createClass({
    render: function() {
        var renderElements = [];
        this.props.menus.forEach(function(menu) {
            if (menu.props.id == this.props.default_id) {
                renderElements.push(<div key={menu.props.id} id={menu.props.id} className="selected"><h1>{menu.props.human_id}</h1><hr />{menu}</div>);
            }
            else {
                renderElements.push(<div key={menu.props.id} id={menu.props.id}><h1>{menu.props.human_id}</h1><hr />{menu}</div>);
            }
        }.bind(this));
        return (
            <div className="mainview view">
                {renderElements}
            </div>
        )
    }
});
var Frame = React.createClass({
    getInitialState: function() {
        return {
            default_id : "styleSwitcher",
            menus : [
                <StyleMenu id="styleSwitcher" human_id="Styles"/>,
                <ScriptMenu id="jsMenu" human_id="Javascript" />
            ]
        }
    },
    render: function() {
        return (
            <div className="frame">
            <NavBar menus={this.state.menus} default_id={this.state.default_id} />
            <MainView menus={this.state.menus} default_id={this.state.default_id} />
            </div>
        )
    }
});
React.render(<Frame />, document.body);
