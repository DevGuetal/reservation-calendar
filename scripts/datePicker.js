'use strict';

var Module = angular.module('datePicker', []);

Module.constant('datePickerConfig', {
  template: 'templates/datepicker.html',
  view: 'date',
  views: ['year', 'month', 'date', 'hours', 'minutes'],
  step: 5
});

Module.filter('time',function () {
  function format(date){
    return ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2);
  }

  return function (date) {
    if (!(date instanceof Date)) {
      date = new Date(date);
      if (isNaN(date.getTime())) {
        return undefined;
      }
    }
    return format(date);
  };
});

Module.directive('datePicker', ['datePickerConfig', 'datePickerUtils', function datePickerDirective(datePickerConfig, datePickerUtils) {

  //noinspection JSUnusedLocalSymbols
  return {
    // this is a bug ?
    require:'?ngModel',
    template: '<div ng-include="template"></div>',
    scope: {
      model: '=datePicker',
      after: '=?',
      before: '=?'
    },
    link: function (scope, element, attrs, ngModel) {

      var arrowClick = false;

	  scope.model = scope.model || {selectedDates: [], curDate: new Date()};
      scope.date = new Date(scope.model.curDate || new Date());
      scope.views = datePickerConfig.views.concat();
      scope.view = attrs.view || datePickerConfig.view;
      scope.now = new Date();
      scope.template = attrs.template || datePickerConfig.template;

      var step = parseInt(attrs.step || datePickerConfig.step, 10);
      var partial = !!attrs.partial;

      /** @namespace attrs.minView, attrs.maxView */
      scope.views =scope.views.slice(
        scope.views.indexOf(attrs.maxView || 'year'),
        scope.views.indexOf(attrs.minView || 'minutes')+1
      );

      if (scope.views.length === 1 || scope.views.indexOf(scope.view)===-1) {
        scope.view = scope.views[0];
      }

      

      scope.setDate = function (date) {
        if(attrs.disabled) {
          return;
        }
        //scope.date = date;
        // change next view
        var nextView = scope.views[scope.views.indexOf(scope.view) + 1];
        if ((!nextView || partial) || scope.model.curDate) {

         // scope.model.curDate = new Date(scope.model.curDate || date);
		 
		  if(date.getDay() === 3 || date.getDay() === 5) {
		  
			if(!datePickerUtils.isCutOff(scope.model, date)) {
		  
			var index = scope.model.selectedDates.indexOf(date);
			if (index < 0) {
				var week = datePickerUtils.weekOfTheYear(date);
				
				scope.model.selectedWeeks = scope.model.selectedWeeks || [];
				
				if(scope.model.selectedWeeks.indexOf(week) < 0) {
					scope.model.selectedWeeks.push(week);
					scope.model.selectedDates.push(date);
				}			
			} else {
				scope.model.selectedDates.splice(index, 1);
				
				var week = datePickerUtils.weekOfTheYear(date);
				scope.model.selectedWeeks.splice(scope.model.selectedWeeks.indexOf(week), 1);
			}
			}
		  }
          //if ngModel , setViewValue and trigger ng-change, etc...
          if(ngModel) {
            ngModel.$setViewValue(scope.model.selectedDates);
          }
        }
      };

      function update() {
        var view = scope.view;

        if (scope.model.curDate && !arrowClick) {
          scope.date = new Date(scope.model.curDate);
          arrowClick = false;
        }
        var date = scope.date;
      
    	scope.weekdays = scope.weekdays || datePickerUtils.getDaysOfWeek();
	    scope.trimester = datePickerUtils.getVisibleMonths(date);
      }

      function watch() {
        if (scope.view !== 'date') {
          return scope.view;
        }
        return scope.model.curDate ? scope.model.curDate.getMonth() : null;
      }


      scope.$watch(watch, update);

      scope.isAfter = function (date) {
        return scope.after && datePickerUtils.isAfter(date, scope.after);
      };

      scope.isBefore = function (date) {
        return scope.before && datePickerUtils.isBefore(date, scope.before);
      };

      scope.isSameMonth = function (date) {
        return datePickerUtils.isSameMonth(scope.model.curDate, date);
      };

      scope.isSameYear = function (date) {
        return datePickerUtils.isSameYear(scope.model.curDate, date);
      };

      scope.isSameDay = function (date) {
        return datePickerUtils.isSameDay(scope.model, date);
      };

      scope.isSameHour = function (date) {
        return datePickerUtils.isSameHour(scope.model.curDate, date);
      };

      scope.isSameMinutes = function (date) {
        return datePickerUtils.isSameMinutes(scope.model.curDate, date);
      };
	  
	  scope.getMonth = function(date, index) {
		return datePickerUtils.getMonth(date, index);
	  }

      scope.isDeliveryAvaiable = function (model, date) {
		var week = datePickerUtils.weekOfTheYear(date);
		
		scope.model.selectedWeeks = scope.model.selectedWeeks || [];
		
        return (date.getDay() == 3 || date.getDay() == 5) && !datePickerUtils.isCutOff(model, date) && scope.model.selectedWeeks.indexOf(week) < 0;
      };
    }
  };
}]);
