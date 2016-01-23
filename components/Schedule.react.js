var React        = require('react');
var Parse        = require('../lib/parse');
var ParseReact   = require('parse-react');
var EventList    = require('./EventList.react.js');
var EventInputForm    = require('./EventInputForm.react.js');

var Schedule = React.createClass({
  mixins: [ParseReact.Mixin],

  getInitialState() {
    return {
      inputForm: false,
      update: null,
    };
  },

  observe(props, state) {
    var type = props.type;
    var account = props.account;

    var planQuery = new Parse.Query("EventPlan");
    planQuery.include('event');
    planQuery.equalTo("user", Parse.User.current());
    planQuery.ascending('date');

    var eventQuery = new Parse.Query('Event');
    eventQuery.ascending('date');
    if(type == "Group"){
      var groupQuery = new Parse.Query(type);
      groupQuery.equalTo('objectId', account.objectId);
      eventQuery.matchesQuery("groups", groupQuery);
    }
    else{ // Artist
      var Artist = Parse.Object.extend("Artist");
      var artist = new Artist();
      artist.id = account.objectId;

      var artistQuery = new Parse.Query("Artist");
      artistQuery.equalTo("objectId", account.objectId);
      var groupsQuery = artist.relation("groups").query();

      var eventArtistQuery = new Parse.Query('Event');
      eventArtistQuery.matchesQuery("artists", artistQuery);

      var eventGroupQuery = new Parse.Query('Event');
      eventGroupQuery.matchesQuery("groups", groupsQuery);

      eventQuery._orQuery([eventArtistQuery, eventGroupQuery]);
    }

    return {
      user: ParseReact.currentUser,
      events: eventQuery,
      plan: planQuery
    };

  },

  popInputForm(){
    // if not login user, redirect for sign up page
    if (!this.data.user) {
      location.href = '/auth/twitter';
      return;
    }

    this.setState({inputForm:true});
  },

  closeInputForm(){
    console.log("closeInputForm");
    this.setState({inputForm:false});
  },

  incrementUpdate(){
  //  this.setState({update: this.state.update + 1});
  },

  refreshEventData(){
   // this.refreshQueries(["events", "plan"]);
  },

  /*
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
 */

  handlers() {
    return {
      incrementUpdate : this.incrementUpdate,
      closeInputForm : this.closeInputForm
    } 
  },

  /*
  componentWillMount(){
    this.setState({update: 0});
  },
 */

  render() {
    return (
      <div>
        <div className="scheduleInputPopup">
          <div className="getFormButton" onClick={this.popInputForm}>イベントを追加</div>
        </div>
        {this.state.inputForm &&
          <EventInputForm account={this.props.account} handlers={this.handlers} mode="new" />
        }
        <div>
        {this.data.events.length > 0
        ? <EventList type={this.props.type} account={this.props.account} events={this.data.events} handlers={this.handlers} mode="all" />
        : <p>登録されているイベントがありません</p>
        }
      </div>
    </div>
    );
  },

});

module.exports = Schedule;
