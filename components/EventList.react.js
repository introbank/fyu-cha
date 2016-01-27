var React        = require('react');
var Parse        = require('../lib/parse');
var ParseReact   = require('parse-react');
var PageType     = require('../lib/PageType.js');
var EventDateLib = require('../lib/EventDateLib.js');
var EventInputForm    = require('./EventInputForm.react.js');
var EventContent = require('./EventContent.react.js');

var EventList = React.createClass({
  mixins: [ParseReact.Mixin],

  getInitialState() {
    return {
      inputForm: false,
      editEvent: null,
    };
  },

  observe(props, state) {
   return {
      user: ParseReact.currentUser,
    };
  },

  popInputForm(event){
    // if not login user, redirect for sign up page
    if (!this.data.user) {
      location.href = '/auth/twitter';
      return;
    }
    console.log(event);
    this.setState({editEvent: event, inputForm:true});
  },

  closeInputForm(){
    console.log("closeInputForm");
    this.setState({inputForm:false});
  },

  handlers() {
    return {
      incrementUpdate : this.props.handlers().incrementUpdate,
      closeInputForm : this.closeInputForm
    } 
  },

  hide(event){
    var data = {user: this.data.user, event:event};
    var userHideEvent = ParseReact.Mutation.Create("UserHideEvent", data);
    return userHideEvent.dispatch();
  },

  show(hiddenObject){
    return ParseReact.Mutation.Destroy(hiddenObject).dispatch();
  },

  createEventList(event, hiddenObject){
    //this.getRelatedAccounts(event);
    try{
      var eventDate = new Date(event.date);
      var divKey = this.props.type + this.props.id + event.objectId + this.props.update;
      var scheduleContentBoxClass = new Date() > eventDate
        ? ("scheduleContentBox finished") : ("scheduleContentBox");

      var hideSwichButton = (hiddenObject === null) 
        ? (<div className="scheduleEditButton" onClick={this.hide.bind(this, event)}>隠す</div>)
        : (<div className="scheduleEditButton" onClick={this.show.bind(this, hiddenObject)}>表示</div>)
      ;

      var eventListHtml = (
        <div key={divKey}>
          {this.previousEventMonth != eventDate.getMonth() && (
            <h2 className="schedulePeriod">
              <span className="scheduleYear">{eventDate.getFullYear()}</span>
              <span className="scheduleMonth">{eventDate.getMonth() + 1}月</span>
            </h2>
          )}
          <div className="scheduleDayWrapper">
            {this.previousEventDay != eventDate.getDate() && (
              <div className="scheduleDayBox finished">
                <h3 className="scheduleDay">{eventDate.getDate()}</h3>
                <p className="scheduleDayOfTheWeek">{EventList.getWeekDaysString(eventDate.getDay())}</p>
              </div>
            )}
            {new Date() < eventDate && !this.isDisplayedNowDivider && (
              <div className="scheduleNowDivider"></div>
            )}
            <div className={scheduleContentBoxClass}>
              <EventContent event={event} />
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
          </div>
        </div>
      );
      this.previousEventMonth = eventDate.getMonth();
      this.previousEventDay = eventDate.getDate();
      if (new Date() < eventDate) {
        this.isDisplayedNowDivider = true;
      }
      return eventListHtml;
    }
    catch(e) {
      console.log(e);
    }
  },

  initEventListFlugs(){
    this.previousEventMonth = -1;
    this.previousEventDay = -1;
    this.isDisplayedNowDivider = false;
  },

  statics: {
    getWeekDaysString(weekdayInt){
      var weekdays = ["Sun", "Mon", "Tue", "Web", "Thu", "Fri", "Sat"];
      return weekdays[weekdayInt];
    },
  },

  getRelatedAccounts(event){
    if(event.artists){
      var artistsRelation = event.artists;
      artistsRelation.query().find().then(function(artists){
        var idList = [];
        for(var i = 0; i < artists.length; i++) {
          idList.push(artists[i].id);
        }
        var artistQuery = new Parse.Query('Artist');
        artistQuery.containedIn("objectId", idList);
        artistQuery.find().then(function(results){
          console.log(results);
          /*
          for(var i = 0; i < results.length; i++){
            console.log(results[0].toJSON());
          }
          */
          });
      });
    }

    if(event.groups){
      var groupsRelation = event.groups;
      groupsRelation.query().find().then(function(groups){
        var idList = [];
        for(var i = 0; i < groups.length; i++) {
           idList.push(groups[i].id);
        }
        var groupQuery = new Parse.Query('Group');
        groupQuery.containedIn("objectId", idList);
        groupQuery.find().then(function(results){
          for(var i = 0; i < results.length; i++){
            console.log(results[0].toJSON());
          }
          });
      });
    }
  },

  render() {
    this.initEventListFlugs();
    var eventList = null;
    var hiddenDict = {}
    if(this.props.hidden){
      this.props.hidden.map(function(hidden){
        hiddenDict[hidden.event.objectId] = hidden;
      });
    }

    console.log(hiddenDict);

    eventList = this.props.events.map(function(event) {
      if(this.props.mode === "selected"){
        if(!hiddenDict.hasOwnProperty(event.objectId)){
          return this.createEventList(event, null)
        }
      }else{
        var hiddenObject = (hiddenDict.hasOwnProperty(event.objectId)) ? hiddenDict[event.objectId] : null;
        return this.createEventList(event, hiddenObject)
      }
    }, this);

    return (
      <div>
        {eventList}
        {this.state.inputForm &&
          <EventInputForm account={this.props.account} handlers={this.handlers} mode="edit" event={this.state.editEvent} />
        } 
      </div>
    );
  },
});

module.exports = EventList;
