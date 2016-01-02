var React        = require('react');
var Parse        = require('../lib/parse');
var ParseReact   = require('parse-react');

var EventList = React.createClass({
  mixins: [ParseReact.Mixin],

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
        plan: planQuery
      };
    }
  },

  refreshEventData(){
    if (this.props.type == "Dashboard"){
      this.refreshQueries(["plan"]);
    }
    else{
      this.refreshQueries(["events", "plan"]); 
    }
  },

  refreshPlanData(){
    if (this.props.type == "Dashboard"){
      this.refreshQueries(["plan"]);
    }
    else{
      this.refreshQueries(["plan"]); 
    }
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
    // if not login user, redirect for sign up page
    if (!this.data.user) {
      location.href = '/auth/twitter';
    }

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
        ? <button className="btn" type="button" key={plan.objectId} onClick={this.quitPlanEvent.bind(this, plan)}>取り消し</button>
        : <button className="btn" type="button" onClick={this.planEvent.bind(this, event)}>お気に入り</button>
      );

      var divKey = (plan != null
      ? this.props.type + this.props.id + event.objectId + this.props.update
      : this.props.type + this.props.id + event.objectId
      );

      var eventListHtml = (
        <div key={this.props.type + event.objectId + new Date().getTime()}>
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
                <p className="scheduleContentName">{event.title}</p>
                <div className="scheduleStar active"></div>
                {this.props.type != "Dashboard" && this.data.user &&
                <button className="btn" type="submit" onClick={this.deleteEvent.bind(this, event)}>イベントを削除</button>
                }
                {planButton}
             </div>
            ) : (
              <div className="scheduleContentBox">
                <p className="scheduleContentTime">{hour}:{minute} -</p>
                <p className="scheduleContentName">{event.title}</p>
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

  componentWillUpdate(nextProps, nextState) {
    // for update
    if(nextProps.update > this.props.update){
      console.log("refreshQueries by update");
      this.refreshEventData();
      //this.setState({update: nextProps.update});
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
    console.log("props.update::" + this.props.update);
    this.initEventListFlugs();
    var eventList = null;
    if (this.props.type == "Dashboard"){
      eventList = this.data.plan.map(function(plan) {
        if (plan.event != null){
        return this.createEventList(plan.event, plan)}
      }, this);
      
    }
    else{
      var planHash = {};
        this.data.plan.map(function(plan){
        if(plan.event != null){
          planHash[plan.event.objectId] = plan;
        }
      });
      eventList = this.data.events.map(function(event) {
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
