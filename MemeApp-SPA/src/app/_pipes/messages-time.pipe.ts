import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'messagesTime'
})
export class MessagesTimePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value) {
      const seconds = Math.floor((+new Date() - +new Date(value)) / 1000);
      const now = Date.now();
      const d = new Date(now);
      const midnight = d.setHours(0, 0, 0, 0);
      const dateToday = d.getDate();
      var yesterdayMidnight = (new Date(midnight).setDate(dateToday - 2));
      const dateMidnightWeekAgo = (new Date(midnight).setDate(dateToday - 7));
      const yearAgo = d.getFullYear();
      const dateYearAgo = (new Date(midnight).setFullYear(yearAgo - 1, d.getMonth(), d.getDate()));
      const intervals = {
          'year': (now - dateYearAgo) / 3600,
          'month': (now - dateMidnightWeekAgo) / 3600,
          'week': (now - yesterdayMidnight) / 3600,
          'yesterday': (now - midnight) / 3600,
          'today': 1
      };
      let counter;
      for (const i in intervals) {
          counter = Math.floor(seconds / intervals[i]);
          if (counter > 0) {
            if (i === 'today') {
                let current = new Date(value);
                console.log(value);
                let time = current.toLocaleTimeString('en-US');
                let timeToReturn = time.substring(0, time.length - 6).concat(` ${time.substring(time.length - 2)}`);
                return timeToReturn;
            } else if (i === 'yesterday') {
                let stringToReturn = 'Yesterday ';
                let current = new Date(value);
                let time = current.toLocaleTimeString('en-US');
                let timeToReturn = time.substring(0, time.length - 6).concat(` ${time.substring(time.length - 2)}`);
              return stringToReturn + timeToReturn;
            } else if (i === 'week') {
                let current = new Date(value);
                let dayOftheWeek = current.getDay();
                let stringToReturn;
                if (dayOftheWeek == 0)
                    stringToReturn = 'Sunday ';
                else if (dayOftheWeek == 1)
                    stringToReturn = 'Monday ';
                else if (dayOftheWeek == 2)
                    stringToReturn = 'Tuesday ';
                else if (dayOftheWeek == 3)
                    stringToReturn = 'Wednesday ';
                else if (dayOftheWeek == 4)
                    stringToReturn = 'Thursday ';
                else if (dayOftheWeek == 5)
                    stringToReturn = 'Friday ';
                else 
                    stringToReturn = 'Saturday ';
                var time = current.toLocaleTimeString('en-US');
                var timeToReturn = time.substring(0, time.length - 6).concat(` ${time.substring(time.length - 2)}`);
                return stringToReturn + timeToReturn;
            } else if (i === 'month') {
                var current = new Date(value);
                var dayOftheWeek = current.getDay();
                var dateNumber = current.getDate();
                var monthNumber = current.getMonth();
                var month = 'Jan';
                if (monthNumber == 1)
                    month = 'Feb';
                else if (monthNumber == 2)
                    month = 'Mar';
                else if (monthNumber == 3)
                    month = 'Apr';
                else if (monthNumber == 4)
                    month = 'May';
                else if (monthNumber == 5)
                    month = 'Jun';
                else if (monthNumber == 6)
                    month = 'Jul';
                else if (monthNumber == 7)
                    month = 'Aug';
                else if (monthNumber == 8)
                    month = 'Sep';
                else if (monthNumber == 9)
                    month = 'Oct';
                else if (monthNumber == 10)
                    month = 'Nov';
                else
                    month = 'Dec';
                
                var stringToReturn;
                if (dayOftheWeek == 0)
                    stringToReturn = `Sun, ${month} ${dateNumber}, `;
                else if (dayOftheWeek == 1)
                    stringToReturn = `Mon, ${month} ${dateNumber}, `;
                else if (dayOftheWeek == 2)
                    stringToReturn = `Tue, ${month} ${dateNumber}, `;
                else if (dayOftheWeek == 3)
                    stringToReturn = `Wed, ${month} ${dateNumber}, `;
                else if (dayOftheWeek == 4)
                    stringToReturn = `Thu, ${month} ${dateNumber}, `;
                else if (dayOftheWeek == 5)
                    stringToReturn = `Fri, ${month} ${dateNumber}, `;
                else 
                    stringToReturn = `Sat, ${month} ${dateNumber}, `;
                var time = current.toLocaleTimeString('en-US');
                var timeToReturn = time.substring(0, time.length - 6).concat(` ${time.substring(time.length - 2)}`);
                return stringToReturn + timeToReturn;
            } else if (i === 'year') {
                var current = new Date(value);
                var dayOftheWeek = current.getDay();
                var dateNumber = current.getDate();
                var monthNumber = current.getMonth();
                var year = current.getFullYear();
                var month = 'Jan';
                if (monthNumber == 1)
                    month = 'Feb';
                else if (monthNumber == 2)
                    month = 'Mar';
                else if (monthNumber == 3)
                    month = 'Apr';
                else if (monthNumber == 4)
                    month = 'May';
                else if (monthNumber == 5)
                    month = 'Jun';
                else if (monthNumber == 6)
                    month = 'Jul';
                else if (monthNumber == 7)
                    month = 'Aug';
                else if (monthNumber == 8)
                    month = 'Sep';
                else if (monthNumber == 9)
                    month = 'Oct';
                else if (monthNumber == 10)
                    month = 'Nov';
                else
                    month = 'Dec';
                
                var stringToReturn;
                if (dayOftheWeek == 0)
                    stringToReturn = `Sun, ${month} ${dateNumber}, ${year}, `;
                else if (dayOftheWeek == 1)
                    stringToReturn = `Mon, ${month} ${dateNumber}, ${year}, `;
                else if (dayOftheWeek == 2)
                    stringToReturn = `Tue, ${month} ${dateNumber}, ${year}, `;
                else if (dayOftheWeek == 3)
                    stringToReturn = `Wed, ${month} ${dateNumber}, ${year}, `;
                else if (dayOftheWeek == 4)
                    stringToReturn = `Thu, ${month} ${dateNumber}, ${year}, `;
                else if (dayOftheWeek == 5)
                    stringToReturn = `Fri, ${month} ${dateNumber}, ${year}, `;
                else 
                    stringToReturn = `Sat, ${month} ${dateNumber}, ${year}, `;
                var time = current.toLocaleTimeString('en-US');
                var timeToReturn = time.substring(0, time.length - 6).concat(` ${time.substring(time.length - 2)}`);
                return stringToReturn + timeToReturn;
            }
          }
              
      }
  }
  return value;
  }

}
