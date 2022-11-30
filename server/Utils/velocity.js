// Required libraries and assets
// const express = require("express");
// Used loop vars: i
const Tools = require('./tools.js');

var methods = {

    get_sprint_vel: function(data, sid) {
        const num_of_cards = (data.pagination.total <= 100) ? data.pagination.total : 100;
        var total = 0;
        for (v6 = 0; v6 < num_of_cards; v6++) {
            temp = data.data[v6];
            if (temp.sprint_id != null) {
                if (temp.sprint.title == sid) {
                    total += temp.points;
                }
            }
        }
        return total;
    },

    get_user_vel: function(data, uid, sid) {
        const num_of_cards = (data.pagination.total <= 100) ? data.pagination.total : 100;
        var total = 0;
        for (v5 = 0; v5 < num_of_cards; v5++) {
            var temp = data.data[v5];
            if (temp.sprint_id != null) {
                if (temp.sprint.title == sid) {
                    if (temp.closer_id == uid) { total += temp.points; }
                }
            }
        }
        return total;   
    },

    get_name_from_id: function(data, id) {
        const num_of_cards = (data.pagination.total <= 100) ? data.pagination.total : 100;
        for (v2 = 0; v2 < num_of_cards; v2++) {
            if (data.data[v2].creator.id == id) {
                return data.data[v2].creator.username;
            } 
        }
    },

    get_velocity_response: function(data) {

        const num_of_cards = (data.pagination.total <= 100) ? data.pagination.total : 100;
        var response = [];

        var sprint_array = [];
        var user_array = [];

        // populating the unique sprints array
        for (v1 = 0; v1 < num_of_cards; v1++) {
            if (data.data[num_of_cards-v1-1].sprint_id != null) {
                if (!sprint_array.includes(data.data[num_of_cards-v1-1].sprint.title)) {
                    sprint_array.push(data.data[num_of_cards-v1-1].sprint.title);
                }
            }
        }

        //populating the unique users array with ids
        for (v1 = 0; v1 < num_of_cards; v1++) {
            if (data.data[v1].closer_id != null) {
                if (!user_array.includes(data.data[v1].closer_id)) {
                    user_array.push(data.data[v1].closer_id);
                }
            }
        }

        //populating the final response
        var l1 = sprint_array.length; var l2 = user_array.length;
        for (v3 = 0; v3 < l1; v3++) {

            for (v4 = 0; v4 < l2; v4++) {

                response[(v3*l2) + v4] = {
                    "sprint_id": sprint_array[v3],
                    "user_id": this.get_name_from_id(data, user_array[v4]),
                    "sprint_velocity": this.get_sprint_vel(data, sprint_array[v3]),
                    "user_velocity": this.get_user_vel(data, user_array[v4], sprint_array[v3])
                }

            }

        }

        console.log(response);

        return response;

    }

};

exports.functions = methods;

// velocity: { G1=sprint velocity(basic bar chart), G2=user_velocity by sprint(grouped column plot): https://charts.ant.design/en/examples/column/grouped#basic
//     [
//         {
//             sprint_id: --> G2-category, G1-x (The name of the sprint in question)
//             user_id: --> G2-x                (The user_id of the user in question. We loop through each user for each sprint)
//             sprint_velocity: --> G1-y        (The velocity of the sprint, number of points completed so far in sprint)
//             user_velocity: G2-y              (The velocity of the user, number of points user has completed during thew sprint)
//         }
//     ]
// }