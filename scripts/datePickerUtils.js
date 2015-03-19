'use strict';

angular.module('datePicker').factory('datePickerUtils', function(){
  return {
    getVisibleMonths : function(date) {
      date = new Date(date || new Date());
      var startMonth = date.getMonth(), startYear = date.getYear();
      
      var months = [];
	  for(var j = 0; j < 3; j++) {
		date.setDate(1);
		date.setHours(0);
		date.setMinutes(0);
		date.setSeconds(0);
		date.setMilliseconds(0);

		if (date.getDay() === 0) {
	      date.setDate(-5);
		} else {
		  date.setDate(date.getDate() - (date.getDay() - 1));
		}
		if (date.getDate() === 1) {
		  date.setDate(-6);
		}
	  
		months[j] = [];		
		while (months[j].length < 6) {
			
		if(date.getYear()=== startYear && date.getMonth() > startMonth + 3) break;
			var week = [];
			for (var i = 0; i < 7; i++) {
			  week.push(new Date(date));
			  date.setDate(date.getDate() + 1);
			}
			
			months[j].push(week);
		  }
	  }
      return months;
    },
    getDaysOfWeek : function(date) {
      date = new Date(date || new Date());
      date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      date.setDate(date.getDate() - (date.getDay() - 1));
      var days = [];
      for (var i = 0; i < 7; i++) {
        days.push(new Date(date));
        date.setDate(date.getDate() + 1);
      }
      return days;
    },

    
    isAfter : function(model, date) {
      model = (model !== undefined) ? new Date(model) : model;
      return model && model.getTime() <= date.getTime();
    },
    isBefore : function(model, date) {
      model = (model !== undefined) ? new Date(model) : model;
      return model.getTime() >= date.getTime();
    },
    isSameYear :   function(model, date) {
      model = (model !== undefined) ? new Date(model) : model;
      return model && model.getFullYear() === date.getFullYear();
    },
    isSameMonth : function(model, date) {
      model = (model !== undefined) ? new Date(model) : model;
      return this.isSameYear(model, date) && model.getMonth() === date.getMonth();
    },
    isSameDay : function(model, date) {
	  //model = (model !== undefined) ? new Date(model) : model;
	  var isSameDay = false;
	  for(var i = 0; i < model.selectedDates.length; i++) {
		isSameDay = this.isSameMonth(model.selectedDates[i], date) && model.selectedDates[i].getDate() === date.getDate();
		if(isSameDay) break;
	  }
      
      return isSameDay;
    },
	getMonth: function(date, index) {
		var monthDate = new Date(date);
		monthDate.setMonth(date.getMonth() + index);
		return monthDate;
	},
	weekOfTheYear: function(date) {
		var janFirst = new Date(date.getFullYear(), 0, 1);
		return Math.ceil( (((date - janFirst) / 86400000) + janFirst.getDay() + 1) / 7 );
	},
	isCutOff: function(model, date) {
		return model.curDate.getDay() > 3 && this.weekOfTheYear(date) < this.weekOfTheYear(model.curDate) +2; 
	}
  };
});