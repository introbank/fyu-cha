var React        = require('react');
var Parse        = require('../lib/parse');
var ParseReact   = require('parse-react');
var EventList    = require('./EventList.react.js');

var Schedule = React.createClass({
  mixins: [ParseReact.Mixin],

  getInitialState() {
    return {
      eventYear: '',
      eventMonth: '',
      eventDay: '',
      eventTitle: '',
      eventPrice: '',
      eventPlace: '',
      eventDetail: '',
      register: 0,
    };
  },

  observe(props, state) {
    var type = props.type;
    var id = props.id;

    if (type == "Dashboard"){
      return{
        user: ParseReact.currentUser,
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
      };
    }
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
    event.save().
      then(
      this.setState(
        {
          eventYear: '',
          eventMonth: '',
          eventDay: '',
          eventTitle: '',
          eventPrice: '',
          eventPlace: '',
          eventDetail: '',
          register: this.state.register + 1,
        })).then(console.log("ok"));
  },

  popInputForm(){
    return (
      <div className="scheduleAddBox">
       <form className="commentForm" onSubmit={this.handleEventSubmit}>
         <h3 className="scheduleAddSubTitle">開催日</h3>
         <input className="scheduleAddInputDay" placeholder="2015" type="number" value={this.state.eventYear} onChange={this.handleEventYearChange} />年
         <input className="scheduleAddInputDay" placeholder="12" type="number" value={this.state.eventMonth} onChange={this.handleEventMonthChange} />月
         <input className="scheduleAddInputDay" placeholder="29" type="number" value={this.state.eventDay} onChange={this.handleEventDayChange} />日
         <h3 className="scheduleAddSubTitle">時間</h3>
         <input type="text" className="scheduleAddInputTime" />〜<input type="text" className="scheduleAddInputTime" />
         <h3 className="scheduleAddSubTitle">イベントタイトル</h3>
         <input type="text" className="scheduleAddInputEventTitle" value={this.state.eventTitle} onChange={this.handleEventTitleChange} />
         <div className="scheduleAddMultiArea">
           <div className="scheduleAddSpotArea">
             <h3 className="scheduleAddSubTitle">場所</h3>
             <input type="text" className="scheduleAddInputSpot" value={this.state.eventPlace} onChange={this.handleEventPlaceChange} />
           </div> 
           <div className="scheduleAddCostArea">
             <h3 className="scheduleAddSubTitle">費用</h3>
             <input type="number" placeholder="1500" className="scheduleAddInputCost" value={this.state.eventPrice} onChange={this.handleEventPriceChange} />円
           </div>
         </div>
         <h3 className="scheduleAddSubTitle">イベントの詳細</h3>
         <textarea className="scheduleAddInputEventDescription" value={this.state.eventDetail} onChange={this.handleEventDetailChange}></textarea>
         <div className="scheduleAddButtonArea">
           <input className="scheduleAddButtonComplete" type="submit" value="完了" />
         </div>
       </form> 
     </div>
    );
  },

  render() {
    var inputForm = this.popInputForm();
    if (this.props.type == "Dashboard" || !this.data.user){
      return (
        <div>
          <EventList type={this.props.type} id={this.props.id} />
        </div>
        );
    }
    else {
      return (
        <div>
          {inputForm}
          <EventList type={this.props.type} id={this.props.id} register={this.state.register} />
        </div>
    );
    }
  },

});

module.exports = Schedule;
