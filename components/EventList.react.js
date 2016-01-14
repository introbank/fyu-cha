var React        = require('react');
var Parse        = require('../lib/parse');
var ParseReact   = require('parse-react');
var PageType     = require('../lib/PageType.js');

var EventList = React.createClass({
  mixins: [ParseReact.Mixin],

  observe(props, state) {
   return {
      user: ParseReact.currentUser,
    };
  },

  incrementUpdate(){
    this.props.handlers().incrementUpdate();
  },

  // to do
  editEvent: function(eventObj){

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

  createEventList(event, plan){
    try{
      var eventDate = new Date(event.date);
      var hour = eventDate.getHours();
      if(hour < 10) { hour = "0" + hour; }
      var minute = eventDate.getMinutes();
      if(minute < 10) { minute = "0" + minute; }

      var planButton = ( plan != null
        ? <button className="btn" type="button" onClick={this.quitPlanEvent.bind(this, plan)}>取り消し</button>
        : <button className="btn" type="button" onClick={this.planEvent.bind(this, event)}>お気に入り</button>
      );

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
                <div className="scheduleStar active"></div>
                {this.props.type != "Dashboard" && this.data.user &&
                <button className="btn" type="submit" onClick={this.deleteEvent.bind(this, event)}>イベントを削除</button>
                }
                {planButton}
             </div>
            ) : (
              <div className="scheduleContentBox">
                <p className="scheduleContentTime">{hour}:{minute} -</p>
                <p className="scheduleContentName">{eventTitle}</p>
                <p className="scheduleContentDescription">{eventDescription}</p>
                <div className="scheduleStar active"></div>
                {this.props.type != "Dashboard" && this.data.user &&
                <button className="btn" type="submit" onClick={this.deleteEvent.bind(this, event)}>イベントを削除</button>
                }
                {planButton}
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
    if (this.props.type == "Dashboard"){
      eventList = this.props.plan.map(function(plan) {
        if (plan.event != null){
        return this.createEventList(plan.event, plan)}
      }, this);

    }
    else{
      var planHash = {};
        this.props.plan.map(function(plan){
        if(plan.event != null){
          planHash[plan.event.objectId] = plan;
        }
      });
      eventList = this.props.events.map(function(event) {
        var plan = null;
        if (event.objectId in planHash){
          plan = planHash[event.objectId];
        }
        return this.createEventList(event, plan)}, this);
    }

    return (
      <div>
        {eventList}
      </div>
    );
  },
});

module.exports = EventList;
