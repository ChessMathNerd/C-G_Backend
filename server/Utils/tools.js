// Required libraries and assets
// const express = require("express");
// Used loop vars: k
const fs = require('fs');
const jsonwebtoken = require('jsonwebtoken'); // $ npm install jsonwebtoken
const axios = require('axios');
const keyUtils = require('./keyUtils.js');
const request = require('request');
// const cors = require('cors');


var date_methods = {

    // We assume that the dates are in the format retuned by the function get_num_date
    subtract_dates: function(date1, date2) {      
        var num_of_days_array = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
        var date1_year = Number(date1[0] + date1[1] + date1[2] + date1[3]);
        var date2_year = Number(date2[0] + date2[1] + date2[2] + date2[3]);
        var date1_month = Number(date1[5] + date1[6]);
        var date2_month = Number(date2[5] + date2[6]);
        var date1_days = Number(date1[8] + date1[9]);
        var date2_days = Number(date2[8] + date2[9]);  
        for (tools_1 = 0; tools_1 < date1_month - 1; tools_1++) {
            date1_days += num_of_days_array[tools_1];
        }
        for (tools_1 = 0; tools_1 < date2_month - 1; tools_1++) {
            date2_days += num_of_days_array[tools_1];
        }    
        var date1_time = (date1_year - 2001) * 365 + date1_days;
        var date2_time = (date2_year - 2001) * 365 + date2_days;
        return date1_time - date2_time;
    },
    
    adjust_date: function(date) {

        if (!date) {
            return "No date";
        }

        // date will be in the following form:
        // "2022-11-14T19:16:33.687Z" --> Nov 14
        // This function takes a string in that format and outputs a JSON object with the info 
        // displayed in a way that can be accessed more easily without string reading

        var result = {
            year: "", 
            month: "", 
            day: ""
        };

        result.year = date[0] + date[1] + date[2] + date[3];
        result.day = date[8] + date[9];

        var month_num = date[5] + date[6];

        if (month_num=="1") {month_num="Jan"}
        else if (month_num=="2") {month_num="Feb"}
        else if (month_num=="3") {month_num="Mar"}
        else if (month_num=="4") {month_num="Apr"}
        else if (month_num=="5") {month_num="May"}
        else if (month_num=="6") {month_num="Jun"}
        else if (month_num=="7") {month_num="Jul"}
        else if (month_num=="8") {month_num="Aug"}
        else if (month_num=="9") {month_num="Sep"}
        else if (month_num=="10") {month_num="Oct"}
        else if (month_num=="11") {month_num="Nov"}
        else {month_num="Dec"}

        result.month = month_num;

        return result;

    }, 

    get_num_date: function(date) {

        var result = "";

        for (k = 0; k < 10; k++) {
            result += date[k];
        }

        return result;

    }

};

var other_methods = {

    // Takes /api/projects data JSON object
    get_proj_array: function(data) {
        const num_of_projects = (data.pagination.total <= 30) ? data.pagination.total : 30;
        var response = [];
        for (tools_2 = 0; tools_2 < num_of_projects; tools_2 ++) {
            response[tools_2] = {
                "id": data.data[tools_2].id,
                "name": data.data[tools_2].name,
                "number": num_of_projects
            }
        }
        return response;
    },

    get_proj_from_sprint: function(data, sid) {

        const num_of_cards = (data.pagination.total <= 100) ? data.pagination.total : 100;

        for (tools_3 = 0; tools_3 < num_of_cards; tools_3 ++) {

			temp = data.data[tools_3]
			if (temp.sprint_id != null) {
				if (temp.sprint.title == sid) {
					return temp.project_id;
				}
			}

        }
		  return null;

    },

    send_test_data: function() {
        return [
          {
            "category-name": "Ready",
            "number-of-cards": 3,
            "length": "1-2 days"
          },
          {
            "category-name": "In Progress",
            "number-of-cards": 3,
            "length": "1-2 days"
          },
          {
            "category-name": "Debugging",
            "number-of-cards": 3,
            "length": "1-2 days"
          },
          {
            "category-name": "Ready",
            "number-of-cards": 2,
            "length": "3-4 days"
          },
          {
            "category-name": "In Progress",
            "number-of-cards": 3,
            "length": "3-4 days"
          },
          {
            "category-name": "Debugging",
            "number-of-cards": 3,
            "length": "3-4 days"
          },
          {
            "category-name": "Ready",
            "number-of-cards": 1,
            "length": "5+ days"
          },
          {
            "category-name": "In Progress",
            "number-of-cards": 1,
            "length": "5+ days"
          },
          {
            "category-name": "Debugging",
            "number-of-cards": 2,
            "length": "5+ days"
          }
        ]
    }

}

exports.date_functions = date_methods;
exports.other_functions = other_methods;
