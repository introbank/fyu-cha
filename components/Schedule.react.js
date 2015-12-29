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

  popInputForm(){
    this.setState({inputForm:true});
  },

  closeInputForm(){
    console.log("closeInputForm");
    this.setState({inputForm:false});
  },

  incrementRegister(){
    this.setState({register:this.state.register});
  },

  handlers() {
    return {
      incrementRegiste : this.incrementRegiste,
      closeInputForm : this.closeInputForm
    } 
  },

  render() {
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
          <div className="scheduleInputPopup">
            <div className="getFormButton" onClick={this.popInputForm}>イベントを追加</div>
          </div>
          {this.state.inputForm &&
            <EventInputForm type={this.props.type} id={this.props.id} handlers={this.handlers}/>
          }
          <EventList type={this.props.type} id={this.props.id} register={this.state.register} />
        </div>
    );
    }
  },

});

module.exports = Schedule;
