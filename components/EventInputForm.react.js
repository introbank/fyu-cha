var React        = require('react');
var Parse        = require('../lib/parse');
var ParseReact   = require('parse-react');
var EventDataLib = require('../lib/EventDataLib.js')
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
      eventUrl: '',
      eventImageUrl: ''
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

  handleEventUrlChange: function(e) {
    this.setState({eventUrl: e.target.value});
  },

  handleEventImageUrlChange: function(e) {
    this.setState({eventImageUrl: e.target.value});
  },

  closeForm(){
    this.initState();
    this.props.handlers().closeInputForm();
  },

  incrementUpdate(){
    return this.props.handlers().incrementUpdate();
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
    var url = this.state.eventUrl;
    var imageUrl = this.state.eventImageUrl;
    if (!year || !month || !day) {
      window.alert("年、月、日、は必ず入力してください");
      return;
    }
    var date = null;
    if(!this.state.eventTime){
      date = EventDataLib.newTimeUnfixedDate(year, month, day);
    }
    else{
      try{
        var time = this.state.eventTime.split(":", 2);
        date = EventDataLib.newTimeFixedDate(year, month, day, time[0], time[1]);
      }
      catch (e){
        date = EventDataLib.newTimeUnfixedDate(year, month, day);
        console.log(date);
      }
    }

    // create event data
    var data = {
      date: date,
      title: title,
      charge: charge,
      place: place,
      detail: detail,
      url: url,
      imageUrl: imageUrl
    };
    var event = null;
    var relation = null;
    var account = this.props.account;
    var closeForm = this.closeForm;
    var incrementUpdate = this.incrementUpdate;

    // add new event
    if(this.state.eventObject === null){
      event = ParseReact.Mutation.Create('Event', data);
      event.dispatch().then(function(createdEvent){
        var col = account.className.toLowerCase() + "s";
        relation = ParseReact.Mutation.AddRelation(createdEvent, col, account);
        relation.dispatch().then(
          function(result){
            console.log(result);
            incrementUpdate();
            closeForm();
          },
          function(error){
            console.log(error);
            window.alert("イベント登録に失敗しました");
          });
      });
    }
    // update event
    else{
      event = ParseReact.Mutation.Set(this.state.eventObject, data);
      event.dispatch().then(
        function(result){
          console.log(result);
          incrementUpdate();
          closeForm();
        },
        function(error){
          console.log(error);
          window.alert("イベントの更新に失敗しました");
        });
    }
  },

  componentWillMount(){
    this.initState();
  },

  initState() {
    if((this.props.mode === "edit") && (this.props.event)){
      var editEvent = this.props.event;
      var date = new Date(editEvent.date);
      var eventTime = null;
      if(EventDataLib.isTimeFixed(date)){
        eventTime = EventDataLib.getHours(date) + ":" + EventDataLib.getMinutes(date);
      }
      return this.setState(
        {
          eventObject: editEvent,
          eventYear: date.getFullYear(),
          eventMonth: date.getMonth() + 1,
          eventDay: date.getDate(),
          eventTime: eventTime,
          eventTitle: editEvent.title,
          eventCharge: editEvent.charge,
          eventPlace: editEvent.place,
          eventDetail: editEvent.detail,
          eventUrl: editEvent.url,
          eventImageUrl: editEvent.imageUrl
        });
    }
    else{
      var now = new Date();
      return this.setState(
        {
          eventObject: null,
          eventYear: now.getFullYear(),
          eventMonth: now.getMonth() + 1,
          eventDay: now.getDate(),
          eventTime: null,
          eventTitle: '',
          eventCharge: '',
          eventPlace: '',
          eventDetail: '',
          eventUrl: '',
          eventImageUrl: ''
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
            <h3 className="scheduleAddSubTitle">会場</h3>
            <input type="text" className="scheduleAddInputSpot" value={this.state.eventPlace} onChange={this.handleEventPlaceChange} />
          </div>
          <div className="scheduleAddCostArea">
            <h3 className="scheduleAddSubTitle">料金</h3>
            <input type="text" className="scheduleAddInputCost" value={this.state.eventCharge} onChange={this.handleEventChargeChange} />
          </div>
        </div>
        <h3 className="scheduleAddSubTitle">イベントの詳細</h3>
        <textarea className="scheduleAddInputEventDescription" value={this.state.eventDetail} onChange={this.handleEventDetailChange}></textarea>
        <h3 className="scheduleAddSubTitle">イベント詳細ページのURL（枠内にリンクを表示）</h3>
        <input type="text" className="scheduleAddInputEventUrl" value={this.state.eventUrl} onChange={this.handleEventUrlChange} />
        <h3 className="scheduleAddSubTitle">イベント関連画像のURL（枠内に画像を表示）</h3>
        <input type="text" className="scheduleAddInputEventImageUrl" value={this.state.eventImageUrl} onChange={this.handleEventImageUrlChange} />
        <div className="scheduleAddButtonArea">
          <div className="scheduleAddButtonOtherTime" onClick={this.closeForm} >フォームを閉じる</div>
          <div className="scheduleAddButtonComplete" onClick={this.handleEventSubmit}>保存</div>
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
