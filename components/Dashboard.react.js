var React  = require('react');
var Parse       = require('../lib/parse');
var ParseReact  = require('parse-react');
var AccountInfo   = require('./AccountInfo.react.js');
var Follow       = require('./Follow.react.js');

var Dashboard = React.createClass({
  mixins: [ParseReact.Mixin],

  getInitialState() {
    return {
      showMedia: true,
      showFollow: false,
      showSchedule: false,
      showData: false,
    };
  },

  newEventStatusQueryInstance(className) {
    var query = new Parse.Query(className);
    query.equalTo("user", Parse.User.current());
    query.include("event");
    query.include("artist");
    query.include("group");
    return query
  },

  parseEventData(eventData) {
    var date = new Date(eventData.date);
    // var
    var name = "";
    var place = "";
    if (eventData.artist){
      name = eventData.artist.name;
    }
    else if (eventData.group) {
      name = eventData.group.name;
    }

    var info = {};
    return {date: date, 
            title: eventData.title,
            aim: name,
            place: eventData.place,
            detail:eventData.detail,
            price: eventData.price.toString()
    };
  },


  mergeEventList(attend, plan) {
    var eventList = [];
    var strList = [];
    attend.map(function(eventData){
      eventList.push(this.parseEventData(eventData));
    });
    plan.map(function(eventData){
      eventList.push(this.parseEventData(eventData));
    });

    // to do sort by date and xx

    for(var i = 0; i < eventList.length; i++){
        var e = eventList[0];
        strList.push(e.date.getDate()+ e.aim + e.place + e.detail + e.price);
    } 
    return strList;
  },

  observe() {
    var followingArtistQuery = new Parse.Query('Following');
    followingArtistQuery.equalTo("user", Parse.User.current());
    followingArtistQuery.include("artist").select("artist");

    var followingGroupQuery = new Parse.Query('Following');
    followingGroupQuery.equalTo("user", Parse.User.current());
    followingGroupQuery.include("group").select("group");

    var twitterContributionQuery = new Parse.Query('TwitterContribution');
    twitterContributionQuery.equalTo("user", Parse.User.current());
    var eventAttendanceQuery = this.newEventStatusQueryInstance('EventAttendance');
    var eventPlanQuery = this.newEventStatusQueryInstance('EventPlan');

    return {
      user: ParseReact.currentUser,
      artist: followingArtistQuery,
      group: followingGroupQuery,
      twitterCbs: twitterContributionQuery,
      attendanceEvents: eventAttendanceQuery,
      planEvents: eventAttendanceQuery
    };
  },

  changeTab1() {
    this.setState({showMedia: true, showFollow: false, showSchedule: false, showData: false});
  },

  changeTab2() {
    this.setState({showMedia: false, showFollow: true, showSchedule: false, showData: false});
  },

  changeTab3() {
    this.setState({showMedia: false, showFollow: false, showSchedule: true, showData: false});
  },

  changeTab4() {
    this.setState({showMedia: false, showFollow: false, showSchedule: false, showData: true});
  },

  render() {
    var account = null;
    if (this.data.user) {
      account = {'imageUrl': this.data.user.imageUrl, 'name': this.data.user.name,'twitterUsername': this.data.user.username,'info': this.data.user.info};
    }
    var totalFyucha = 0;
    var eventStrList = this.mergeEventList.bind(this, this.data.attendanceEvents, this.data.planEvents);
    return (
      <div id="content">
        <AccountInfo account={account}/>
        <div className="tabArea">
          <div className="contents">
            <ul className="tabs">
              <li id="label__tab1"><a href="#" className="tab1 boR" onClick={this.changeTab1}>動画/画像</a></li>
              <li id="label__tab2"><a href="#" className="tab1 boR" onClick={this.changeTab2}>フォロー</a></li>
              <li id="label__tab3"><a href="#" className="tab1 boR" onClick={this.changeTab3}>スケジュール</a></li>
              <li id="label__tab4"><a href="#" className="tab1 boR" onClick={this.changeTab4}>データ</a></li>
            </ul>
            {this.state.showMedia &&
            <div id="images" className="tab">
              <ul>
                <li>ここに写真が入ります</li>
                <li>ここに写真が入ります</li>
                <li>ここに写真が入ります</li>
                <li>ここに写真が入ります</li>
                <li>ここに写真が入ります</li>
              </ul>
              <span className="viewMore">もっと見る</span>
            </div>
            }
            {this.state.showFollow &&
            <div id="followList" className="tab">
              <div className="box">
                <h1>アーティスト</h1>
                <ul>
                  {this.data.artist.map(function (artist) {
                    return (
                      <li>
                        <a href={'artists/' + artist.twitterUsername}><img src={artist.imageUrl} /></a>
                        <h2>{artist.name}</h2>
                      </li>
                    )
                  })}
                </ul>
                <p className="cf"></p>
              </div>
              <div className="box">
                <h1>グループ</h1>
                <ul>
                  {this.data.group.map(function (group) {
                    return (
                      <li>
                        <a href={'groups/' + group.twitterUsername}><img src={group.imageUrl} /></a>
                        <a href={'groups/' + group.twitterUsername}><h2>{group.name}</h2></a>
                      </li>
                    )
                  })}
                </ul>
                <p className="cf"></p>
              </div>
            </div>
            }
            {this.state.showSchedule &&
            <div id="tab3" className="tab">
              <ul>
              {this.data.attendanceEvents.map(function(attendanceEvent) {
                var eventDate = new Date(attendanceEvent.event.date);
                var name = "";
                var place = "";
                if (attendanceEvent.artist){
                  name = attendanceEvent.artist.name;
                }
                else if (attendanceEvent.group) {
                  name = attendanceEvent.group.name;
                }

                if (attendanceEvent.event.place){
                  place = attendanceEvent.event.place;
                }

                return (
                  <li> {eventDate.getMonth() + 1}月{eventDate.getDate()}日|| {name} || {attendanceEvent.event.title}@{place} </li>
                )
                })
                
              }

              </ul>
            </div>
            }
            {this.state.showData &&
            <div id="tab4" className="tab">
              <ul>
                {this.data.twitterCbs.map(function(twitterCb) {
                  totalFyucha += twitterCb.point;
                  if (twitterCb.artist){
                    return(
                      <li>{twitterCb.artist.name}(@{twitterCb.artist.twitterUsername})さんに{twitterCb.type}して{twitterCb.point}ふゅーちゃ！</li>
                    )
                  }
                  else if (twitterCb.group) {
                    return (
                      <li>{twitterCb.group.name}(@{twitterCb.group.twitterUsername})さんに{twitterCb.type}して{twitterCb.point}ふゅーちゃ！</li>
                    )
                  }
                })
                }
              </ul>
              <p>合計 {totalFyucha} ふゅーちゃ！しています</p>
            </div>
            }
          </div>
        </div>
      </div>
    );
  },

});

module.exports = Dashboard;
