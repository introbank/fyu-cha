var React        = require('react');
var Parse        = require('../lib/parse');
var ParseReact   = require('parse-react');
var PageType     = require('../lib/PageType.js');
var EventDateLib = require('../lib/EventDateLib.js');
var EventInputForm    = require('./EventInputForm.react.js');
var AccountInfoLib = require('../lib/AccountInfoLib.js');

var EventContent = React.createClass({
  mixins: [ParseReact.Mixin],

  getInitialState() {
    return {
      inputForm: false,
      editEvent: null,
    };
  },

  observe(props, state) {
    var event = props.event;
    var artistQuery = null;
    var groupQuery = null;
    if(event.artists){
      artistQuery = event.artists.query();
    }
    if(event.groups){
      groupQuery = event.groups.query();
    }

    if(artistQuery === null && groupQuery === null){
      return {
        user: ParseReact.currentUser,
      };  
    }
    else if (artistQuery !== null && groupQuery === null){
      return {
        user: ParseReact.currentUser,
        artist: artistQuery,
      };       
    }
    else if (artistQuery == null && groupQuery !== null){
      return {
        user: ParseReact.currentUser,
        group: groupQuery,
      };       
    }
    else{
     return {
        user: ParseReact.currentUser,
        artist: artistQuery,
        group: groupQuery,
      };       
    } 
  },

  popInputForm(event){
    this.props.handlers().popInputForm(event); 
  },

  hide(event){
    var data = {user: this.data.user, event:event};
    var userHideEvent = ParseReact.Mutation.Create("UserHideEvent", data);
    return userHideEvent.dispatch();
  },

  show(hiddenObject){
    return ParseReact.Mutation.Destroy(hiddenObject).dispatch();
  },

  createEventContent(event, hiddenObject){
    try{
      var eventDate = new Date(event.date);
      var hour = EventDateLib.getHours(eventDate);
      var minute = EventDateLib.getMinutes(eventDate);
      var eventTitle = event.title !== null ? event.title : "";
      var eventDescription = "";
      if(event.place){
        eventDescription += "会場：" + event.place + " ";
      }
      if(event.charge){
        eventDescription += "料金：" +event.charge + " ";
      }
      if(event.detail){
        eventDescription += "詳細：" +event.detail;
      }

      var accountList = this.getRelatedAccountList();
      var iconImage = null;
      if(accountList.length > 0){
        var account = accountList[0];
        var iconImageStyle = {backgroundImage:'url(' + AccountInfoLib.getImageUrl(account) + ')'};
        var url =AccountInfoLib.getUrl(account); 
        var iconImage = (<a className="scheduleIcon" style={iconImageStyle} href={url}></a>)
      }
      var scheduleContentBoxClass = new Date() > eventDate
        ? ("scheduleContentBox finished") : ("scheduleContentBox");
      var hideSwichButton = (hiddenObject === null) 
        ? (<div className="scheduleEditButton" onClick={this.hide.bind(this, event)}>隠す</div>)
        : (<div className="scheduleEditButton" onClick={this.show.bind(this, hiddenObject)}>表示</div>)
      ;

      var eventContent = (
        <div className={scheduleContentBoxClass}>
          {iconImage}
          <p className="scheduleContentTime">{hour}:{minute} -</p>
          <p className="scheduleContentName">{eventTitle}</p>
          <p className="scheduleContentDescription">{eventDescription}</p>
          {this.props.type !== PageType.Dashboard() && this.data.user &&
          <div>
            <div className="scheduleEditButton" onClick={this.popInputForm.bind(this, event)}>編集</div>
          </div>
          }
          {this.props.type === PageType.Dashboard() && this.props.mode === "all" &&
          <div>
            {hideSwichButton}
          </div>
          }
        </div> 
      );
      return eventContent;
    }
    catch(e) {
      console.log(e);
    }
  },

  getRelatedAccountList(){
    var accountList = [];
    this.data.artist.map(function(artist){
      console.log(artist);
      accountList.push(artist);
    });
    this.data.group.map(function(group){
      console.log(group);
      accountList.push(group);
    });
    return accountList;
  },



  render() {
    console.log(this.getRelatedAccountList());
    return this.createEventContent(this.props.event, this.props.hidden);
  },

});

module.exports = EventContent;
