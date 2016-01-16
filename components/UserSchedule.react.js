var React        = require('react');
var Parse        = require('../lib/parse');
var ParseReact   = require('parse-react');
var EventList    = require('./EventList.react.js');
var FollowingLib = require('../lib/FollowingLib');

var UserSchedule = React.createClass({
  mixins: [ParseReact.Mixin],

  getInitialState() {
    return {
      inputForm: false,
      update: null,
    };
  },

  observe(props, state) {
    var artists = FollowingLib.getArtistList(props.artists);
    var artistQueryList = [];
    for(var i = 0; i < artists.length; i++){
      var eventQuery = new Parse.Query('Event');
      var artistQuery = new Parse.Query('Artist');
      eventQuery.equalTo('artists', artists[i]);
      artistQueryList.push(eventQuery);
    }

    var groups = FollowingLib.getGroupList(props.groups);
    var groupQueryList = [];
    for(var i = 0; i < groups.length; i++){
      var eventQuery = new Parse.Query('Event');
      eventQuery.equalTo('groups', groups[i]);
      groupQueryList.push(eventQuery);
    }

    var queryList = artistQueryList.concat(groupQueryList);
    var eventQuery = new Parse.Query('Event');
    for(var i = 0; i < queryList.length; i++){
      if(i == 0){
        eventQuery = queryList[i];
      }
      else{
        eventQuery = Parse.Query.or(eventQuery, queryList[i]);
      }
    }
    eventQuery.ascending('date');

    return {
      user: ParseReact.currentUser,
      events: eventQuery,
    };

  },

  incrementUpdate(){
    this.setState({update: this.state.update + 1});
  },

  refreshEventData(){
    this.refreshQueries(["events"]);
  },

  componentWillUpdate(nextProps, nextState) {
    // for update
    if(nextState.update > this.state.update){
      console.log("refreshQueries by update=" + nextState.update);
      this.refreshEventData();
    }
  },

  componentWillMount(){
    this.refreshEventData();
  },

  handlers() {
    return {
      incrementUpdate : this.incrementUpdate,
    } 
  },

  componentWillMount(){
    this.setState({update: 0});
  },

  render() {
    console.log(this.data.events);
    if(this.state.update != null){
      return (
        <div>
          {this.data.events.length > 0
          ? <EventList type={this.props.type} account={this.props.account} events={this.data.events} />
          : <p>登録されているイベントがありません</p>
          }
        </div>
      );
    }
    else{
      return null;
    }
  },

});

module.exports = UserSchedule;
