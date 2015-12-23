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

  newEventStatusQueryInstance(className) {
    var query = new Parse.Query(className);
    query.equalTo("user", Parse.User.current());
    query.include("event");
    query.include("artist");
    query.include("group");
    return query
  },

  observe(props, state) {
    var type = props.type;
    var id = props.id;
    if (type == "Dashboard"){
      var eventPlanQuery = this.newEventStatusQueryInstance('EventPlan');

      return {
        user: ParseReact.currentUser,
        plans: eventPlanQuery,
      };
    }
    else{
      var accountQuery = new Parse.Query(type);
      accountQuery.equalTo('twitterUsername', id);

      var eventQuery = new Parse.Query('Event');
      eventQuery.ascending('date');
      eventQuery.matchesQuery(type.toLowerCase() + 's', accountQuery);
      var eventPlanQuery = this.newEventStatusQueryInstance('EventPlan');

      return {
        user: ParseReact.currentUser,
        account: accountQuery,
        events: eventQuery,
        plans: eventPlanQuery,
      };
    }
  },

  // to do
  editEvent: function(eventObj){

  },

  // to do
  deleteEvent(targetEvent){
    var Event = Parse.Object.extend('Event');
    var ev = new Event();
    ev.id = targetEvent.objectId;
    ev.destroy().then(
        this.setState({update: true}));
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

  setEventStatus: function(targetEvent, eventStatus){
    eventStatus.set("event", {"__type":"Pointer", "className": targetEvent.className, "objectId": targetEvent.objectId});
    eventStatus.set("user", {"__type":"Pointer", "className": this.data.user.className, "objectId":this.data.user.objectId});
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
    eventStatus.save(null, {
      success: function(res){console.log(res.text);},
      error: function(error){console.log(error.text);}
    });
  },

  getEvents(){
    var events = [];
    if (this.props.type == "Dashboard"){
      this.data.plans.map(function(plan) {
        events.push(plan.event);
      });
    }
    else{
      this.data.events.map(function(event)){
        events.push(plan.event);
      }
    }
    return events;
  },


  render() {
    var events = this.getEvents();
    var previousEventMonth = -1;
    var previousEventDay = -1;
    var weekdays = ["Sun", "Mon", "Tue", "Web", "Thu", "Fri", "Sat"];
    var isDisplayedNowDivider = false;
    var eventList = this.data.events.map(function(event) {
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
                <button className="btn" type="button" onClick={this.attendEvent.bind(this, event)}>attend</button>
                <button className="btn" type="button" onClick={this.planEvent.bind(this, event)}>plan</button>
              </div>
            ) : (
              <div className="scheduleContentBox">
                <p className="scheduleContentTime">{hour}:{minute} -</p>
                <p className="scheduleContentName">{event.title}</p>
                <div className="scheduleStar active"></div>
                <button className="btn" type="button" onClick={this.deleteEvent.bind(this, event)}>delete</button>
                <button className="btn" type="button" onClick={this.attendEvent.bind(this, event)}>attend</button>
                <button className="btn" type="button" onClick={this.planEvent.bind(this, event)}>plan</button>
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
    }, this);

    return (
      <div>
        {eventList}
      </div>
    );
  },
});

module.exports = EventList;
