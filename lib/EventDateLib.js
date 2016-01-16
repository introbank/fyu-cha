class EventDateLib {

  static getHours(date){
    var hour = date.getHours();
    if(hour < 10) { hour = "0" + hour; }
    return hour;
  }

  static getMinutes(date){
    var minute = date.getMinutes();
    if(minute < 10) { minute = "0" + minute;}
    return minute;    
  }
  static getYear(date){
    return date.getFullYear();
  }

  static getMonth(date){
    return date.getMonth() + 1;
  }

  static getDate(date){
    return date.getDate();
  }

}

module.exports = EventDateLib;
