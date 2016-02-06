class EventDataLib {

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

  static getDescription(event){
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
    return eventDescription;
  }

  static getTitle(event){
    return event.title !== null ? event.title : "";
  }

  static getUrl(event){
    return event.url !== null ? event.url : "";
  }

  static getImageUrl(event){
    return event.imageUrl !== null ? event.imageUrl : "";
  }

  static newTimeFixedDate(year, month, day, hour, minute){
    return new Date(year, month-1, day, hour, minute);
  }

  static newTimeUnfixedDate(year, month, day){
    return new Date(year, month-1, day, 0, 0, 1);
  }

  static isTimeFixed(date){
    return (date.getSeconds() === 0);
  }

}

module.exports = EventDataLib;
