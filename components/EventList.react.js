var React        = require('react');
var Parse        = require('../lib/parse');
var ParseReact   = require('parse-react');

var EventList = React.createClass({
  mixins: [ParseReact.Mixin],

  getInitialState() {
    return {
      eventYear: '',
      eventMonth: '',
      eventDay: '',
      eventTitle: '',
      eventPrice: '',
      eventPlace: '',
      eventDetail: ''
    };
  },


  observe(props, state) {
    var type = props.type;
    var id = props.id;

    var accountQuery = new Parse.Query(type);
    accountQuery.equalTo('twitterUsername', id);

    var eventQuery = new Parse.Query('Event');
    eventQuery.ascending('date');
    eventQuery.matchesQuery(type.toLowerCase() + 's', accountQuery);

    return {
      user: ParseReact.currentUser,
      account: accountQuery,
      events: eventQuery,
    };
  },

  handleEventYearChange: function(e) {
    this.setState({eventYear: e.target.value});
  },

  handleEventMonthChange: function(e) {
    this.setState({eventMonth: e.target.value});
  },

  handleEventDayChange: function(e) {
    this.setState({eventDay: e.target.value});
  },

  handleEventTitleChange: function(e) {
    this.setState({eventTitle: e.target.value});
  },

  handleEventPriceChange: function(e) {
    this.setState({eventPrice: e.target.value});
  },

  handleEventPlaceChange: function(e) {
    this.setState({eventPlace: e.target.value});
  },

  handleEventDetailChange: function(e) {
    this.setState({eventDetail: e.target.value});
  },

  handleEventSubmit(e) {
    e.preventDefault();
    var year = this.state.eventYear;
    var month = this.state.eventMonth;
    var day = this.state.eventDay;
    var title = this.state.eventTitle.trim();
    var price = this.state.eventPrice;
    var place = this.state.eventPlace;
    var detail = this.state.eventDetail.trim();
    if (!year || !month || !day || !title) {
      return;
    }
    var Event = Parse.Object.extend('Event');
    var event = new Event();
    var date = new Date(year, month-1, day);
    event.set('date', date);
    event.set('title', title);
    event.set('price', Number(price));
    event.set('place', place);
    event.set('detail', detail);
    if (this.props.type === 'Artist') {
      var Artist = Parse.Object.extend('Artist');
      var artist = new Artist();
      artist.id = this.data.account[0].id.objectId;
      var relation = event.relation('artists');
      relation.add(artist);
    } else {
      var Group = Parse.Object.extend('Group');
      var group = new Group();
      group.id = this.data.account[0].id.objectId;
      var relation = event.relation('groups');
      relation.add(group);
    }
    event.save();
    this.setState({author: '', text: ''});
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


  render() {
    return (
      <div>
        <form className="commentForm" onSubmit={this.handleEventSubmit}>
          <input type="text" value={this.state.eventYear} onChange={this.handleEventYearChange} />年
          <input type="text" value={this.state.eventMonth} onChange={this.handleEventMonthChange} />月
          <input type="text" value={this.state.eventDay} onChange={this.handleEventDayChange} /> 日　　　
          <input type="text" placeholder="イベントタイトル" value={this.state.eventTitle} onChange={this.handleEventTitleChange} />
          <input type="text" placeholder="場所" value={this.state.eventPlace} onChange={this.handleEventPlaceChange} />
          <input type="text" placeholder="費用" value={this.state.eventPrice} onChange={this.handleEventPriceChange} /> 円 
          <input type="text" placeholder="イベント詳細" value={this.state.eventDetail} onChange={this.handleEventDetailChange} />
          <input type="submit" value="登録" />
        </form>
        {this.data.events.map(function(event) {
          var eventDate = new Date(event.date);
          return (
            <li>{event.title} @ {event.place}
              <ul>
                <li>{eventDate.getMonth() + 1}月{eventDate.getDate()}日 {event.price}円</li>
                <li>{event.detail}</li>
                <li><button className="btn" type="button" onClick={this.attendEvent.bind(this, event)}>attend</button></li>
                <li><button className="btn" type="button" onClick={this.planEvent.bind(this, event)}>plan</button></li>
              </ul>
            </li>
          )
        }, this)}
      </div>
    );
  },
});

module.exports = EventList;