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
var Menu = React.createClass({
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
            <div className="buttonContainer">
                <div className="online"> {this.state.online ? 'online' : 'offline'}</div>
                <Button url="https://raw.githubusercontent.com/calvcoll/rhodochronsite/master/rhodo.css" name="Rhodochronsite" current={this.state.current} setCurrent={this.setCurrent}/>
                <Button url="https://raw.githubusercontent.com/WinterReign/Snowflake/master/snowflake%20classic%20black.css" name="Snowflake-Classic-Black" current={this.state.current} setCurrent={this.setCurrent}/>
                <Button url="https://raw.githubusercontent.com/WinterReign/Snowflake/master/snowflake%20classic%20light.css" name="Snowflake-Classic-Light" current={this.state.current} setCurrent={this.setCurrent}/>
                <Button url="https://raw.githubusercontent.com/FractalHexagon/Snowflake/master/snowflake%20minima%20black%20aero.css" name="Snowflake-Minima-Black-Aero" current={this.state.current} setCurrent={this.setCurrent}/>
            </div>
        );
    }
});
var NavBar = React.createClass({
    render: function () {
        var renderElements = [];
        var navbar = this;
        this.props.menus.forEach(function(menu) {
            if (menu.props.id == navbar.props.default_id) {
                renderElements.push(<li className="#selected"><a href={"#"+ menu.props.id}>{menu.props.id}</a></li>);
            }
            else {
                renderElements.push(<li><a href={"#"+ menu.props.id}>{menu.props.id}</a></li>);
            }
        });
        return (
            <div className="navigation">
                <div className="logo">
                    <img class="logo" src="img/snowflake_logo-48.png" alt="snowflake-logo"></img>
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
        var view = this;
        this.props.menus.forEach(function(menu) {
            if (menu.props.id == view.props.default_id) {
                renderElements.push(<div id={menu.props.id} className="selected">{menu}</div>);
            }
            else {
                renderElements.push(<div id={menu.props.id}>{menu}</div>);
            }
        });
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
            default_id : "styleSwitcher", // may cause problems in the future. (overwriting shit)
            menus : [
                <Menu id="styleSwitcher"/>
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


var DEPRECRATED_TABGET = function () {
    //chrome.tabs.query({url: '*://tweetdeck.twitter.com/*'}, function(tabs) {
    //    tabs.forEach(function(tab) {
    //        chrome.tabs.sendMessage(tab.id, {start:true}, function(response){
    //            console.log("message sent: looking for a button ");
    //            console.log(response);
    //            if (!(response == undefined || response.button == null || response.button == "")) {
    //                 console.log('button got');
    //                 current = response.button;
    //            }
    //        });
    //    });
    //});
};