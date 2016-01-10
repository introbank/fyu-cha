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
    return{
      user: ParseReact.currentUser,
    };
  },

  popInputForm(){
    this.setState({inputForm:true});
  },

  closeInputForm(){
    console.log("closeInputForm");
    this.setState({inputForm:false});
  },

  incrementUpdate(){
    this.setState({update: this.state.update + 1});
  },

  handlers() {
    return {
      incrementUpdate : this.incrementUpdate,
      closeInputForm : this.closeInputForm
    } 
  },

  componentWillMount(){
    this.setState({update: 0});
  },

  render() {
    if (this.props.type == "Dashboard" || !this.data.user){
      if(this.state.update != null){
        return (
          <div>
            <EventList type={this.props.type} account={this.props.account} update={this.state.update} handlers={this.handlers} />
          </div>
        );
      }
      else{
        return null;
      }
    }
    else {
      if(this.state.update != null){
        return (
          <div>
            <div className="scheduleInputPopup">
              <div className="getFormButton" onClick={this.popInputForm}>イベントを追加</div>
            </div>
            {this.state.inputForm &&
              <EventInputForm account={this.props.account} handlers={this.handlers}/>
            }
            <EventList type={this.props.type} account={this.props.account} update={this.state.update} handlers={this.handlers} />
          </div>
        );
      }
      else{
        return null; 
      }
    }
  },

});

module.exports = Schedule;
