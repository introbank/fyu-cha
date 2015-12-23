var React        = require('react');
var Parse        = require('../lib/parse');
var ParseReact   = require('parse-react');

var EventView = React.createClass({
  mixins: [ParseReact.Mixin],

  getInitialState() {
    return {
      update: null,
      attend: null,
      plan: null
    };
  },

  observe(props, state) {
    return {
      user: ParseReact.currentUser,
    };
  },

  // to do
  editEvent: function(eventObj){

  },

  // to do
  deleteEvent(){
    var Event = Parse.Object.extend('Event');
    var ev = new Event();
    ev.id = this.props.event.objectId;
    ev.destroy().then(
        this.setState({update: true}));
  },

  attendEvent: function() {
    var EventAttendance = Parse.Object.extend("EventAttendance");
    var eventAttendance = new EventAttendance();
    this.setEventStatus(eventAttendance);
  },

  planEvent: function() {
    var EventPlan = Parse.Object.extend("EventPlan");
    var eventPlan = new EventPlan();
    this.setEventStatus(eventPlan);
  },

  setEventStatus: function(eventStatus){
    eventStatus.set("event", {"__type":"Pointer", "className": this.props.event.className, "objectId": this.props.event.objectId});
    eventStatus.set("user", {"__type":"Pointer", "className": this.data.user.className, "objectId":this.data.user.objectId});
    if (this.props.type === 'Artist') {
      var Artist = Parse.Object.extend('Artist');
      var artist = new Artist();
      artist.id = this.props.id.objectId;
      eventStatus.set("artist", artist);
    } else {
      var Group = Parse.Object.extend('Group');
      var group = new Group();
      group.id = this.props.id.objectId;
      eventStatus.set("group", group);
    }
    eventStatus.save(null, {
      success: function(res){console.log(res.text);},
      error: function(error){console.log(error.text);}
    });
  },

  render() {
    var event = this.props.event;
    var previousEventMonth = -1;
    var previousEventDay = -1;
    var weekdays = ["Sun", "Mon", "Tue", "Web", "Thu", "Fri", "Sat"];
    var isDisplayedNowDivider = false;
    var eventDate = new Date(event.date);
    var hour = eventDate.getHours();
    if(hour < 10) { hour = "0" + hour; }
    var minute = eventDate.getMinutes();
    if(minute < 10) { minute = "0" + minute; }
    var eventHtml = (
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
              <button className="btn" type="button" onClick={this.deleteEvent.bind(this, event)}>delete</button>
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

    return eventHtml;
  },
});

module.exports = EventView;
