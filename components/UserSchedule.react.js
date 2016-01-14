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
    var artistEventQuery = new Parse.Query('Event');
    artistEventQuery.containedIn('artists', artists);

    var groups = FollowingLib.getGroupList(props.groups);
    var groupEventQuery = new Parse.Query('Event');
    groupEventQuery.containedIn('groups', groups);

    var eventQuery = new Parse.Query(artistEventQuery, groupEventQuery);
    eventQuery.ascending('date');

    var planQuery = new Parse.Query("EventPlan");
    planQuery.include('event');
    planQuery.equalTo("user", Parse.User.current());
    planQuery.ascending('date');

    return {
      user: ParseReact.currentUser,
      events: eventQuery,
      plan: planQuery
    };

  },

  incrementUpdate(){
    this.setState({update: this.state.update + 1});
  },

  refreshEventData(){
    this.refreshQueries(["events", "plan"]);
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
    if(this.state.update != null){
      return (
        <div>
          {this.data.events.length > 0
          ? <EventList type={this.props.type} account={this.props.account} events={this.data.events} plan={this.data.plan} />
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
