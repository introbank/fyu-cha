var React        = require('react');
var Parse        = require('../lib/parse');
var ParseReact   = require('parse-react');

var EventList = React.createClass({
  mixins: [ParseReact.Mixin],

  getInitialState() {
    return {
      update: null,
      attend: null,
      plan: null
    };
  },

  observe(props, state) {
    var type = props.type;
    var id = props.id;

    var planQuery = new Parse.Query("EventPlan");
    planQuery.include('event');
    planQuery.equalTo("user", Parse.User.current());
    planQuery.ascending('date');

    if (type == "Dashboard"){
      return{
        user: ParseReact.currentUser,
        plan: planQuery
      };
    }
    else{
      var accountQuery = new Parse.Query(type);
      accountQuery.equalTo('twitterUsername', id);

      var eventQuery = new Parse.Query('Event');
      eventQuery.ascending('date');
      eventQuery.matchesQuery(type.toLowerCase() + 's', accountQuery);

      return {
        user: ParseReact.currentUser,
        account: accountQuery,
        events: eventQuery,
        plan: planQuery,
      };
    }
  },


  // to do
  editEvent: function(eventObj){

  },

  // to do handling plan/attend data
  deleteEvent(targetEvent){
    var Event = Parse.Object.extend('Event');
    var ev = new Event();
    ev.id = targetEvent.objectId;
    ev.destroy().then(
      this.refreshQueries(["plan", "events"])
    );
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
    eventPlan.destroy().then(
      this.refreshQueries(["plan", "events"])
    );
  },

  setEventStatus: function(targetEvent, eventStatus){
    eventStatus.set("event", {"__type":"Pointer", "className": targetEvent.className, "objectId": targetEvent.objectId});
    eventStatus.set("user", {"__type":"Pointer", "className": this.data.user.className, "objectId":this.data.user.objectId});
    eventStatus.set("date", targetEvent.date);
    if (this.props.type === 'Artist') {
      var Artist = Parse.Object.extend('Artist');
      var artist = new Artist();
      artist.id = this.data.account[0].id.objectId;
      eventStatus.set("artist", artist);
    } else {
      var Group = Parse.Object.extend('Group');
      var group = new Group();
      group.id = this.data.account[0].id.objectId;
      eventStatus.set("group", group);
    }
    eventStatus.save().then(
      this.refreshQueries(["plan", "events"])
    );
  },

  createEventList(event, previousEventMonth, previousEventDay, weekdays, isDisplayedNowDivider, plan){
    try{
      var eventDate = new Date(event.date);
      var hour = eventDate.getHours();
      if(hour < 10) { hour = "0" + hour; }
      var minute = eventDate.getMinutes();
      if(minute < 10) { minute = "0" + minute; }
      var eventListHtml = (
        <div>
          {previousEventMonth != eventDate.getMonth() && (
            <h2 className="schedulePeriod">
              <span className="scheduleYear">{eventDate.getFullYear()}</span>
              <span className="scheduleMonth">{eventDate.getMonth() + 1}月</span>
            </h2>
          )}
          <div className="scheduleDayWrapper">
            {previousEventDay != eventDate.getDate() && (
              <div className="scheduleDayBox finished">
                <h3 className="scheduleDay">{eventDate.getDate()}</h3>
                <p className="scheduleDayOfTheWeek">{weekdays[eventDate.getDay()]}</p>
              </div>
            )}
            {new Date() < eventDate && !isDisplayedNowDivider && (
              <div className="scheduleNowDivider"></div>
            )}
            {new Date() > eventDate ? (
              <div className="scheduleContentBox finished">
                <p className="scheduleContentTime">{hour}:{minute} -</p>
                <p className="scheduleContentName">{event.title}</p>
                <div className="scheduleStar active"></div>
                {this.props.type != "Dashboard" &&
                <button className="btn" type="button" onClick={this.deleteEvent.bind(this, event)}>delete</button>
                }
                {plan == null 
                ? <button className="btn" type="button" onClick={this.planEvent.bind(this, event)}>plan</button>
                : <button className="btn" type="button" onClick={this.quitPlanEvent.bind(this, plan)}>quit plan</button>
                }
              </div>
            ) : (
              <div className="scheduleContentBox">
                <p className="scheduleContentTime">{hour}:{minute} -</p>
                <p className="scheduleContentName">{event.title}</p>
                <div className="scheduleStar active"></div>
                {this.props.type != "Dashboard" &&
                <button className="btn" type="button" onClick={this.deleteEvent.bind(this, event)}>delete</button>
                }
                {plan == null 
                ? <button className="btn" type="button" onClick={this.planEvent.bind(this, event)}>plan</button>
                : <button className="btn" type="button" onClick={this.quitPlanEvent.bind(this, plan)}>quit plan</button>
                }
              </div>
            )}

          </div>
        </div>
      );
      previousEventMonth = eventDate.getMonth();
      previousEventDay = eventDate.getDate();
      if (new Date() < eventDate) {
        isDisplayedNowDivider = true;
      }
      return eventListHtml;
    }
    catch(e) {
      console.log(e); 
    }
  },

  render() {
    var previousEventMonth = -1;
    var previousEventDay = -1;
    var weekdays = ["Sun", "Mon", "Tue", "Web", "Thu", "Fri", "Sat"];
    var isDisplayedNowDivider = false;
    var eventList = null;
    if (this.props.type == "Dashboard"){
      eventList = this.data.plan.map(function(plan) {
        if (plan.event != null){
        console.log(plan.event);
        return this.createEventList(plan.event, previousEventMonth, previousEventDay, weekdays, isDisplayedNowDivider, plan)}
      }, this);
      
    }
    else{
      eventList = this.data.events.map(function(event) {
        return this.createEventList(event, previousEventMonth, previousEventDay, weekdays, isDisplayedNowDivider, null)}, this);
    }
    return (
      <div>
        {eventList}
      </div>
    );
  },
});

module.exports = EventList;
