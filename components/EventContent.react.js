var React        = require('react');
var Parse        = require('../lib/parse');
var ParseReact   = require('parse-react');
var PageType     = require('../lib/PageType.js');
var EventDataLib = require('../lib/EventDataLib.js');
var EventInputForm    = require('./EventInputForm.react.js');
var AccountInfoLib = require('../lib/AccountInfoLib.js');

var EventContent = React.createClass({
  mixins: [ParseReact.Mixin],

  getInitialState() {
    return {
      inputForm: false,
      editEvent: null,
      isDisplayDetail: false
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

  clickEvent() {
    this.setState({isDisplayDetail: !this.state.isDisplayDetail});
  },

  createEventContent(event, hiddenObject){
    try{
      var eventDate = new Date(event.date);
      var isTimeFixed = EventDataLib.isTimeFixed(eventDate);
      if(isTimeFixed){
        var hour = EventDataLib.getHours(eventDate);
        var minute = EventDataLib.getMinutes(eventDate);
      }
      var eventTitle = EventDataLib.getTitle(event);
      var eventDescription = EventDataLib.getDescription(event);
      var eventUrl = EventDataLib.getUrl(event);
      var eventImageUrl = EventDataLib.getImageUrl(event);

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
        ? (<div className="scheduleHideButton" onClick={this.hide.bind(this, event)}>隠す</div>)
        : (<div className="scheduleHideButton" onClick={this.show.bind(this, hiddenObject)}>表示</div>)
      ;

      var eventContent = (
        <div className={scheduleContentBoxClass} onClick={this.clickEvent}>
          {iconImage}
          {isTimeFixed
          ? <p className="scheduleContentTime">{hour}:{minute} -</p>
          : <p className="scheduleContentTime">時間未定</p>
          }
          <p className="scheduleContentName">{eventTitle}</p>
          {this.state.isDisplayDetail
          ?
            <div>
              <p className="scheduleContentDescription">
                {eventDescription}
              </p>
              {eventUrl !== '' &&
                <p className="scheduleContentUrl">
                  詳細ページ： <a target="_blank" href={eventUrl}>{eventUrl}</a>
                </p>
              }
              {eventImageUrl !== '' &&
                <p className="scheduleContentImage">
                  <img src={eventImageUrl}/>
                </p>
              }
              {!PageType.isDashboard(this.props.type) && this.data.user &&
                <div className="scheduleEditButton" onClick={this.popInputForm.bind(this, event)}>編集</div>
              }
            </div>
          :
            <div>
              <p className="scheduleContentDescription">
                {eventDescription.substr(0, 50) + "..."}
              </p>
              <p className="scheduleDescriptionMore">▼</p>
            </div>
          }
          {PageType.isDashboard(this.props.type) && this.props.mode === "all" &&
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
    this.data.group.map(function(group){
      accountList.push(group);
    });
    this.data.artist.map(function(artist){
      accountList.push(artist);
    });
    return accountList;
  },

  render() {
    return this.createEventContent(this.props.event, this.props.hidden);
  },

});

module.exports = EventContent;
