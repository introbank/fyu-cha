var React        = require('react');
var Parse        = require('../lib/parse');
var ParseReact   = require('parse-react');
var PageType     = require('../lib/PageType.js');
var EventDateLib = require('../lib/EventDateLib.js');
var EventInputForm    = require('./EventInputForm.react.js');

var EventList = React.createClass({
  mixins: [ParseReact.Mixin],

  getInitialState() {
    return {
      inputForm: false,
      edit: null,
      update: null,
    };
  },

  observe(props, state) {
   return {
      user: ParseReact.currentUser,
    };
  },

  incrementUpdate(){
    this.props.handlers().incrementUpdate();
  },

  incrementUpdate(){
    this.setState({update: this.state.update + 1});
  },

  handlers() {
    return {
      incrementUpdate : this.incrementUpdate,
      closeInputForm : this.closeInputForm
    } 
  },


  // to do handling plan/attend data
  deleteEvent(targetEvent){
    var Event = Parse.Object.extend('Event');
    var ev = new Event();
    ev.id = targetEvent.objectId;
    ev.destroy().then(this.incrementUpdate());
  },

  attendEvent: function(targetEvent) {
    var EventAttendance = Parse.Object.extend("EventAttendance");
    var eventAttendance = new EventAttendance();
    this.setEventStatus(targetEvent, eventAttendance);
  },

  planEvent: function(targetEvent) {
    var EventPlan = Parse.Object.extend("EventPlan");
    var eventPlan = new EventPlan();
    this.setEventStatus(targetEvent, eventPlan);
  },

  quitPlanEvent(plan) {
    var EventPlan = Parse.Object.extend("EventPlan");
    var eventPlan = new EventPlan();
    eventPlan.id = plan.objectId;
    eventPlan.destroy().then(this.incrementUpdate());
  },

  popInputForm(event){
    // if not login user, redirect for sign up page
    if (!this.data.user) {
      location.href = '/auth/twitter';
      return;
    }

    this.setState({edit: event, inputForm:true});
  },

  closeInputForm(){
    console.log("closeInputForm");
    this.setState({inputForm:false});
  },

  setEventStatus: function(targetEvent, eventStatus){
    eventStatus.set("event", {"__type":"Pointer", "className": targetEvent.className, "objectId": targetEvent.objectId});
    eventStatus.set("user", {"__type":"Pointer", "className": this.data.user.className, "objectId":this.data.user.objectId});
    eventStatus.set("date", targetEvent.date);
    if (this.props.type === 'Artist') {
      var Artist = Parse.Object.extend('Artist');
      var artist = new Artist();
      artist.id = this.props.account.objectId;
      eventStatus.set("artist", artist);
    } else {
      var Group = Parse.Object.extend('Group');
      var group = new Group();
      group.id = this.props.account.objectId;
      eventStatus.set("group", group);
    }
    eventStatus.save().then(this.incrementUpdate());
  },

  createEventList(event){
    try{
      var eventDate = new Date(event.date);
      var hour = EventDateLib.getHours(eventDate);
      var minute = EventDateLib.getMinutes(eventDate);

      var divKey = this.props.type + this.props.id + event.objectId + this.props.update;

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
            {new Date() > eventDate ? (
              <div className="scheduleContentBox finished">
                <p className="scheduleContentTime">{hour}:{minute} -</p>
                <p className="scheduleContentName">{eventTitle}</p>
                <p className="scheduleContentDescription">{eventDescription}</p>
                {this.props.type !== PageType.Dashboard() && this.data.user &&
                <div>
                  <div className="scheduleEditButton" onClick={this.popInputForm.bind(this, event)}>編集</div>
                  <button className="btn" type="submit" onClick={this.deleteEvent.bind(this, event)}>イベントを削除</button>
                </div>
                }
             </div>
            ) : (
              <div className="scheduleContentBox">
                <p className="scheduleContentTime">{hour}:{minute} -</p>
                <p className="scheduleContentName">{eventTitle}</p>
                <p className="scheduleContentDescription">{eventDescription}</p>
                {this.props.type !== PageType.Dashboard() && this.data.user &&
                <div>
                  <div className="scheduleEditButton" onClick={this.popInputForm.bind(this, event)}>編集</div>
                  <button className="btn" type="submit" onClick={this.deleteEvent.bind(this, event)}>イベントを削除</button>
                </div>
                }
              </div>
            )}

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

  render() {
    this.initEventListFlugs();
    var eventList = null;
    var hideList = [];
    if(this.props.hides){
      this.props.hides.map(function(hide){
        hideList.push(hide.event.objectId);    
      });
    }
    console.log(hideList);

    eventList = this.props.events.map(function(event) {
      if(hideList.indexOf(event.objectId)){
        return this.createEventList(event)
      }
    }, this);

    return (
      <div>
        {eventList}
        {this.state.inputForm &&
          <EventInputForm account={this.props.account} handlers={this.handlers} mode="edit" event={this.state.edit} />
        } 
      </div>
    );
  },
});

module.exports = EventList;
