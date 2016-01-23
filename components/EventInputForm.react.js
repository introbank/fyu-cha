var React        = require('react');
var Parse        = require('../lib/parse');
var ParseReact   = require('parse-react');
var EventDateLib = require('../lib/EventDateLib.js')
var EventInputForm = React.createClass({
  mixins: [ParseReact.Mixin],

  getInitialState() {
    var now = new Date();
    
    return {
      eventObject: null,
      eventYear: now.getFullYear(),
      eventMonth: now.getMonth() + 1,
      eventDay: now.getDate(),
      eventTime: null,
      eventTitle: '',
      eventCharge: '',
      eventPlace: '',
      eventDetail: '',
    };
  },

  observe(props, state) {
    return {
      user: ParseReact.currentUser,
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

  handleEventTimeChange: function(e) {
    this.setState({eventTime: e.target.value});
  },

  handleEventTitleChange: function(e) {
    this.setState({eventTitle: e.target.value});
  },

  handleEventChargeChange: function(e) {
    this.setState({eventCharge: e.target.value});
  },

  handleEventPlaceChange: function(e) {
    this.setState({eventPlace: e.target.value});
  },

  handleEventDetailChange: function(e) {
    this.setState({eventDetail: e.target.value});
  },

  handleEventSubmit() {
    // if not login user, redirect for sign up page
    if (!this.data.user) {
      location.href = '/auth/twitter';
    }
    var now = new Date();
    var year = this.state.eventYear;
    var month = this.state.eventMonth;
    var day = this.state.eventDay;
    var title = this.state.eventTitle.trim();
    var charge = this.state.eventCharge;
    var place = this.state.eventPlace;
    var detail = this.state.eventDetail.trim();
    if (!year || !month || !day) {
      window.alert("年、月、日、は必ず入力してください");
      return;
    }
    var date = null;
    try{
      var time = this.state.eventTime.split(":", 2);
      date = new Date(year, month-1, day, time[0], time[1]);
    }
    catch (e){
      date = new Date(year, month-1, day);
    }
    var data = {
      date: date,
      title: title,
      charge: charge,
      place: place,
      detail: detail
    };
    console.log(data);
    // create event data
    var event = null;
    var relation = null;
    var account = this.props.account;

    if(this.state.eventObject === null){
      event = ParseReact.Mutation.Create('Event', data); 
      event.dispatch().then(function(createdEvent){
        var col = account.className.toLowerCase() + "s";
        relation = ParseReact.Mutation.AddRelation(createdEvent, col, account);
        relation.dispatch().then(
          function(result){
            console.log(result);
          },
          function(error){
            console.log(error);
          });
      });
    }
    

    /*
    try{
    event.dispatch().
      then(function(result){
      this.setState(
        {
          eventYear: now.getFullYear(),
          eventMonth: now.getMonth() + 1,
          eventDay: now.getDate(),
          eventTime: null,
          eventTitle: '',
          eventCharge: '',
          eventPlace: '',
          eventDetail: ''
        }).then(this.props.handlers().incrementUpdate())
        .then(console.log("ok"))}, 
        function(error){
          console.log(error);
        });
    }catch (e){
      console.log(e);
    }
    */
  },

  closeForm(){
    this.props.handlers().closeInputForm();  
  },

  componentWillMount(){
    this.initState();
  },

  initState() {
    if((this.props.mode === "edit") && (this.props.event)){
      var editEvent = this.props.event;
      var date = new Date(editEvent.date);
      var hour = EventDateLib.getHours(date);
      var minute = EventDateLib.getMinutes(date);
      this.setState(
        {
          eventObject: editEvent,
          eventYear: date.getFullYear(),
          eventMonth: date.getMonth() + 1,
          eventDay: date.getDate(),
          eventTime: hour + ":" + minute,
          eventTitle: editEvent.title,
          eventCharge: editEvent.charge,
          eventPlace: editEvent.place,
          eventDetail: editEvent.detail
        }); 
    }
  },

  getInputFormHtml(){
    return (
    <div className="scheduleAddBox">
      <form className="commentForm">
        <h3 className="scheduleAddSubTitle">開催日</h3>
        <input className="scheduleAddInputDay" type="number" value={this.state.eventYear} onChange={this.handleEventYearChange} />年
        <input className="scheduleAddInputDay" type="number" value={this.state.eventMonth} onChange={this.handleEventMonthChange} />月
        <input className="scheduleAddInputDay" type="number" value={this.state.eventDay} onChange={this.handleEventDayChange} />日
        <h3 className="scheduleAddSubTitle">開始時間</h3>
        <input type="time" className="scheduleAddInputTime" value={this.state.eventTime} onChange={this.handleEventTimeChange} />〜
        <h3 className="scheduleAddSubTitle">イベントタイトル</h3>
        <input type="text" className="scheduleAddInputEventTitle" value={this.state.eventTitle} onChange={this.handleEventTitleChange} />
        <div className="scheduleAddMultiArea">
          <div className="scheduleAddSpotArea">
            <h3 className="scheduleAddSubTitle">場所</h3>
            <input type="text" className="scheduleAddInputSpot" value={this.state.eventPlace} onChange={this.handleEventPlaceChange} />
          </div> 
          <div className="scheduleAddCostArea">
            <h3 className="scheduleAddSubTitle">費用</h3>
            <input type="text" className="scheduleAddInputCost" value={this.state.eventCharge} onChange={this.handleEventChargeChange} />
          </div>
        </div>
        <h3 className="scheduleAddSubTitle">イベントの詳細</h3>
        <textarea className="scheduleAddInputEventDescription" value={this.state.eventDetail} onChange={this.handleEventDetailChange}></textarea>
        <div className="scheduleAddButtonArea">
          <div className="scheduleAddButtonOtherTime" onClick={this.closeForm} >フォームを閉じる</div>
          <div className="scheduleAddButtonComplete" onClick={this.handleEventSubmit}>完了</div>
        </div>
      </form> 
    </div>
   );
  },

  render() {
    var inputFormHtml = this.getInputFormHtml();
    return(
      <div>
        {inputFormHtml}
      </div>
    );
  },
});

module.exports = EventInputForm;
