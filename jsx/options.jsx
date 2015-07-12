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
       if (this.props.name.indexOf('-')>-1) {
           rendername = this.props.name.split('-').join(' ');
       }
        return (
            <button className="chrome-bootstrap" onClick={this.onClick}>
                {rendername} { + (this.props.current == this.props.name) ? " ✓" : ""}
            </button>
        );
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
                <Button url="https://raw.githubusercontent.com/WinterReign/Snowflake/master/snowflake%20classic%20black.css" name="Snowflake-Classic-Black" current={this.state.current} setCurrent={this.setCurrent}/>
                <Button url="https://raw.githubusercontent.com/WinterReign/Snowflake/master/snowflake%20classic%20light.css" name="Snowflake-Classic-Light" current={this.state.current} setCurrent={this.setCurrent}/>
                <Button url="https://github.com/pixeldesu/technicolour/releases/download/v3.0.0/technicolour-dark.css" name="Technicolour" current={this.state.current} setCurrent={this.setCurrent} />
                <Button url="https://raw.githubusercontent.com/FractalHexagon/Snowflake/master/snowflake%20minima%20black%20aero.css" name="Snowflake-Minima-Black-Aero" current={this.state.current} setCurrent={this.setCurrent}/>
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