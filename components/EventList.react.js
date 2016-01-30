var React        = require('react');
var Parse        = require('../lib/parse');
var ParseReact   = require('parse-react');
var PageType     = require('../lib/PageType.js');
var EventInputForm    = require('./EventInputForm.react.js');
var EventContent = require('./EventContent.react.js');

var EventList = React.createClass({
  mixins: [ParseReact.Mixin],

  observe(props, state) {
   return {
      user: ParseReact.currentUser,
    };
  },

  getInitialState() {
    return {
      inputForm: false,
      editEvent: null,
    };
  },

  closeInputForm(){
    this.setState({inputForm:false});
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

  handlers() {
    return {
      incrementUpdate : this.props.handlers().incrementUpdate,
      popInputForm: this.popInputForm,
    } 
  },

  createEventList(event, hiddenObject){
    try{
      var eventDate = new Date(event.date);
      var divKey = this.props.type + this.props.id + event.objectId + this.props.update;
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
              <EventContent event={event} hidden={hiddenObject} handlers={this.handlers} type={this.props.type} mode={this.props.mode} />
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
