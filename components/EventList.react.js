var React        = require('react');
var Parse        = require('../lib/parse');
var ParseReact   = require('parse-react');
var EventView    = require('./EventView.react.js');

var EventList = React.createClass({
  mixins: [ParseReact.Mixin],

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

  getDefaultProps() {
    return {
      count: 0
    };
  },


  render() {
    var type = this.props.type;
    var id = this.props.id;
    return(
      <div>
      {this.data.events.map && this.data.events.map(function(event){
        return(
           <div>
             <EventView type={type} id={id} event={event} />
           </div>
         );                                                                
      })}
      </div>
    );
      
  },
});

module.exports = EventList;
