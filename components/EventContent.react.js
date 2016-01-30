var React        = require('react');
var Parse        = require('../lib/parse');
var ParseReact   = require('parse-react');
var PageType     = require('../lib/PageType.js');
var EventDateLib = require('../lib/EventDateLib.js');
var EventInputForm    = require('./EventInputForm.react.js');

var EventContent = React.createClass({
  mixins: [ParseReact.Mixin],

  getInitialState() {
    return {
      inputForm: false,
      editEvent: null,
    };
  },

  observe(props, state) {
   return {
      user: ParseReact.currentUser,
    };
  },

  popInputForm(event){
    this.props.handlers().popInputForm(event); 
  },

  hide(event){
    var data = {user: this.data.user, event:event};
    var userHideEvent = ParseReact.Mutation.Create("UserHideEvent", data);
    return userHideEvent.dispatch();
  },

  show(hiddenObject){
    return ParseReact.Mutation.Destroy(hiddenObject).dispatch();
  },

  createEventContent(event, hiddenObject){
    try{
      var eventDate = new Date(event.date);
      var hour = EventDateLib.getHours(eventDate);
      var minute = EventDateLib.getMinutes(eventDate);
      var eventTitle = event.title !== null ? event.title : "";
      var eventDescription = "";
      if(event.place){
        eventDescription += "会場：" + event.place + " ";
      }
      if(event.charge){
        eventDescription += "料金：" +event.charge + " ";
      }
      if(event.detail){
        eventDescription += "詳細：" +event.detail;
      }

      var scheduleContentBoxClass = new Date() > eventDate
        ? ("scheduleContentBox finished") : ("scheduleContentBox");
      var hideSwichButton = (hiddenObject === null) 
        ? (<div className="scheduleEditButton" onClick={this.hide.bind(this, event)}>隠す</div>)
        : (<div className="scheduleEditButton" onClick={this.show.bind(this, hiddenObject)}>表示</div>)
      ;

      var eventContent = (
        <div className={scheduleContentBoxClass}>
          <p className="scheduleContentTime">{hour}:{minute} -</p>
          <p className="scheduleContentName">{eventTitle}</p>
          <p className="scheduleContentDescription">{eventDescription}</p>
          {this.props.type !== PageType.Dashboard() && this.data.user &&
          <div>
            <div className="scheduleEditButton" onClick={this.popInputForm.bind(this, event)}>編集</div>
          </div>
          }
          {this.props.type === PageType.Dashboard() && this.props.mode === "all" &&
          <div>
            {hideSwichButton}
          </div>
          }
        </div> 
      );
      return eventContent;
    }
    catch(e) {
      console.log(e);
    }
  },

  getRelatedAccounts(event){
    if(event.artists){
      var artistsRelation = event.artists;
      artistsRelation.query().find().then(function(artists){
        var idList = [];
        for(var i = 0; i < artists.length; i++) {
          idList.push(artists[i].id);
        }
        var artistQuery = new Parse.Query('Artist');
        artistQuery.containedIn("objectId", idList);
        artistQuery.find().then(function(results){
          console.log(results);
          /*
          for(var i = 0; i < results.length; i++){
            console.log(results[0].toJSON());
          }
          */
          });
      });
    }

    if(event.groups){
      var groupsRelation = event.groups;
      groupsRelation.query().find().then(function(groups){
        var idList = [];
        for(var i = 0; i < groups.length; i++) {
           idList.push(groups[i].id);
        }
        var groupQuery = new Parse.Query('Group');
        groupQuery.containedIn("objectId", idList);
        groupQuery.find().then(function(results){
          for(var i = 0; i < results.length; i++){
            console.log(results[0].toJSON());
          }
          });
      });
    }
  },

  render() {
    return this.createEventContent(this.props.event, this.props.hidden);
  },

});

module.exports = EventContent;
