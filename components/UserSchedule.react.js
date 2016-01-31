var React        = require('react');
var Parse        = require('../lib/parse');
var ParseReact   = require('parse-react');
var EventList    = require('./EventList.react.js');
var FollowingLib = require('../lib/FollowingLib');
var PageType = require('../lib/PageType.js');
var moment = require('moment');

var UserSchedule = React.createClass({
  mixins: [ParseReact.Mixin],

  getInitialState() {
    return {
      editMode: false,
      hideEventObjectList: null,
      update: null,
    };
  },

  observe(props, state) {
    var userHideEventQuery = new Parse.Query("UserHideEvent");
    userHideEventQuery.equalTo('user', Parse.User.current());
    userHideEventQuery.limit(1000);

    var artists = FollowingLib.getArtistList(props.artists);
    var groups = FollowingLib.getGroupList(props.groups);

    if(artists.length + groups.length === 0){
      return{
        user: ParseReact.currentUser,
        hidden: userHideEventQuery,
      };
    }

    var artistQueryList = [];
    var groupQueryList = [];

    for(var i = 0; i < artists.length; i++){
      // artist own event
      var eventQuery = new Parse.Query('Event');
      eventQuery.equalTo('artists', artists[i]);
      artistQueryList.push(eventQuery);

      // related group event
      var Artist = Parse.Object.extend("Artist");
      var artist = new Artist();
      artist.id = artists[i].objectId;
      var eventGroupQuery = new Parse.Query('Event');
      eventGroupQuery.matchesQuery("groups", artist.relation("groups").query());
      groupQueryList.push(eventGroupQuery);
    }

    for(var i = 0; i < groups.length; i++){
      var eventQuery = new Parse.Query('Event');
      eventQuery.equalTo('groups', groups[i]);
      groupQueryList.push(eventQuery);
    }

    var queryList = artistQueryList.concat(groupQueryList);
    var eventQuery = null;
    for(var i = 0; i < queryList.length; i++){
      if(i === 0){
        eventQuery = queryList[i];
      }
      else{
        eventQuery = Parse.Query.or(eventQuery, queryList[i]);
      }
    }
    var today = moment();
    today.set({hour:0, minute:0, second:0, millisecond:0});
    eventQuery.greaterThan("date", today.toDate());
    eventQuery.ascending('date');
    eventQuery.limit(1000);

    return {
      user: ParseReact.currentUser,
      events: eventQuery,
      hidden: userHideEventQuery,
    };

  },

  switchEditMode(event) {
    console.log("switchEditMode");
    this.setState({editMode: !this.state.editMode, update: this.state.update + 1});
  },

  incrementUpdate(){
    this.setState({update: this.state.update + 1});
  },

  componentWillUpdate(nextProps, nextState) {
    // for update
    if(nextState.update > this.state.update){
      console.log("refreshQueries by update=" + nextState.update);
      this.refreshQueries(["hidden"]);
    }
  },

  handlers() {
    return {
      incrementUpdate : this.incrementUpdate,
    }
  },

  render() {
    var hiddenDict = {};
    if(this.data.hidden){
      this.data.hidden.map(function(hidden){
        hiddenDict[hidden.event.objectId] = hidden;
      });
    }
    // if no folloing
    if(!this.data.events){
      return(<p className="dashboardScheduleInfo">表示するイベントがありません</p>);
    }

    if(this.state.editMode){
      return (
        <div>
          <div className="scheduleEditStartButton" onClick={this.switchEditMode}>完<br />了</div>
          {this.data.events.length > 0
          ? <EventList type={PageType.Dashboard()} events={this.data.events} hidden={hiddenDict} mode="all" handlers={this.handlers}/>
          : <p className="dashboardScheduleInfo">登録されているイベントがありません</p>
          }
        </div>
      );
    }
    else{
      return (
        <div>
          <div className="scheduleEditStartButton" onClick={this.switchEditMode}>編<br />集</div>
          {this.data.events.length !== hiddenDict.length
          ? <EventList type={PageType.Dashboard()} events={this.data.events} hidden={hiddenDict} mode="selected" handlers={this.handlers}/>
          : <p className="dashboardScheduleInfo">表示するイベントがありません</p>
          }
        </div>
      );
    }
  },

});

module.exports = UserSchedule;
