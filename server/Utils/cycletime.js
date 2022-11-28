// Required libraries and assets
// const express = require("express");
// Used loop vars: i
const Tools = require('./tools.js');

var methods = {

    get_avg_time: function(data, sprint_name) {

        var counter = 0;
        var result = 0;
        var num_of_cards = data.pagination.total;

        for (cycletime_1 = 0; cycletime_1 < num_of_cards; cycletime_1++) {

            var temp = data.data[cycletime_1];
            if (temp.sprint_id != null) {

                if (temp.closed_at != null && temp.sprint.title == sprint_name) {
                    counter ++;
                    result += Tools.date_functions.subtract_dates(
                        Tools.date_functions.get_num_date(temp.closed_at), 
                        Tools.date_functions.get_num_date(temp.created_at));
                }
            }
        }

        return result/Number(counter + '.0');
    },

    get_cycle_time_response: function(data) {

        var sprint_array = [];
        var response = [];

        var num_of_cards = data.pagination.total;

        // Get a list of unique sprint_names
        for (i = 0; i < num_of_cards; i++) {
            if (data.data[i].sprint_id != null) {
                if (!sprint_array.includes(data.data[i].sprint.title)) {
                    sprint_array.push(data.data[i].sprint.title);
                }
            }
        }

        for (i = 0; i < sprint_array.length; i++) {
            response[i] = {
                "sprint_name": sprint_array[i],
                "cycle_time": this.get_avg_time(data, sprint_array[i])
            }
        }

        return response;

    }

};

exports.functions = methods;

// cycletime: {
//     [
//         {
//             sprint_name: --> x-field
//             average_time_completed: --> y-field
//         }
//     ]
// }
