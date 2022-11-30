// Required libraries and assets
// const express = require("express");
const fs = require('fs');
const jsonwebtoken = require('jsonwebtoken'); // $ npm install jsonwebtoken
const axios = require('axios');
const keyUtils = require('./keyUtils.js');
const request = require('request');
const Tools = require('./Tools.js');
// const cors = require('cors');


var methods = {

    get_projects: function(data) {
        var num_of_cards = (data.pagination.total <= 100) ? data.pagination.total : 100;
        var id;
        var project_ids = [];
        for (i = 0; i < length; i++) {
            id = data.data[i].project_id;
            if (!project_ids.includes(id)) {
                project_ids.push(id);
            }
        }
        console.log(project_ids);
        return project_ids;
    },

    // ONLY WORKS when sprint.title is input for the sprint_name!!!!
    get_sprint_points: function(data, sprint_name) {
        const info = data;
        const num_of_cards = (data.pagination.total <= 100) ? data.pagination.total : 100;
        var total_points = 0;
        for (j = 0; j < num_of_cards; j++) {
            if (info.data[j].sprint_id != null) {
                if (info.data[j].sprint.title == sprint_name) {
                    total_points += info.data[j].points;
                }
            }
        }
        return total_points;
    },

    get_complete_points: function(data, array, index, sprint_name) {

        // The index gives the position of the date in question
        // If a card in data has the right sprint_name, is complete, and was completed on or before that date
        // We add its points to the total
        var complete_points = 0;

        var num_of_cards = (data.pagination.total <= 100) ? data.pagination.total : 100;

        for (l = 0; l < num_of_cards; l++) {
            var temp = data.data[l];
            if (temp.sprint_id != null) {
                if (temp.sprint.title==sprint_name && temp.closed_at != null) {
                    var temp2 = Tools.date_functions.get_num_date(temp.closed_at);
                    var contained = false;
                    for (q = 0; q <= index; q++) {
                        if (array[q]==temp2) contained = true;
                    }
                    if (contained) {
                        complete_points += temp.points;
                    }
                } 
            }
        }
        return complete_points;
    },
   
    get_burnup_burndown_response: function(data) {
        // we loop through the date array, and create an object for each sprint_id, for each date in that array.  
        var response = [];
        var length = (data.pagination.total <= 100) ? data.pagination.total : 100;
        var date_array_temp = [];
        var date_array = [];
        var sprint_id_array = [];
        var sprint_point_array = [];

        // Create the distinct dates array
        for (i = 0; i < length; i++) {
            if (data.data[i].closed_at!=null) {
                var temp = Tools.date_functions.get_num_date(data.data[i].closed_at);
                if (!date_array_temp.includes(temp)) {
                    date_array_temp.push(temp);
                }
            }
        }

        // Create the distinct sprint_id array
        for (i = 0; i < length; i++) {
            if (data.data[i].sprint_id!=null) {
                var temp = data.data[i].sprint.title;
                if (!sprint_id_array.includes(temp)) {
                    sprint_id_array.push(temp);
                }
            }
        }

        // Create the corresponding sprint_id point array
        for (i = 0; i < sprint_id_array.length; i++) {
            sprint_point_array[i] = this.get_sprint_points(data, sprint_id_array[i]);
        }

        date_array = date_array_temp.sort();

        // All three arrays are now done and sorted correctly. This loop now generates the response
        var num_of_sprints = sprint_id_array.length;
        var num_of_dates = date_array.length;
        for (i = 0; i < num_of_sprints; i++) {
            for (j = 0; j < num_of_dates; j++) {
                response[(i*num_of_dates) + j] = {
                    "sprint-id": sprint_id_array[i],
                    "points-in-sprint": sprint_point_array[i],
                    "date": date_array[j],
                    "points-done": this.get_complete_points(data, date_array, j, sprint_id_array[i]),
                    "points-remaining": sprint_point_array[i] - this.get_complete_points(data, date_array, j, sprint_id_array[i])
                }
            }
        }

        console.log(response);

        return response;
    }

};

exports.functions = methods;

// burnupburndown: {
//     [
//         {
//             sprint_id: --> series-field
//             project_id: --> id for displaying each project one at a time via react passed params
//             total_points_in_sprint: 
//             date: --> x-field
//             points_done_at_date: --> y-field
//         }
//     ]
// }

