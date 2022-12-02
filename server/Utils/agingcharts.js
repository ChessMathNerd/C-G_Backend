// Required libraries and assets
// const express = require("express");
// Used loop vars: ac0 ac1 ac2 ac3
const Tools = require('./tools.js');

var methods = {

    get_projID_from_sprint_name: function(data, sprint_name) {     
        var counter = 0;
        while (true) {
            temp2 = data.data[counter];
            if (temp2.sprint != null) {
                if (temp2.sprint.title == sprint_name) {
                    return temp2.project_id;
                }
            }
            counter ++;
        }
    },

    get_cards_in_interval: function(data, sprint_name, project_id, interval, isend, category_name) {

        // get current date and do current - card.date_created
        // If the result is in the desired interval, increment the return value
        var result = 0;
        const num_of_cards = (data.pagination.total <= 100) ? data.pagination.total : 100;

        var temp_date = new Date();
        var day = ("0" + temp_date.getDate()).slice(-2);
        var month = ("0" + (temp_date.getMonth() + 1)).slice(-2);
        var year = temp_date.getFullYear();
        var current_date = year + "-" + month + "-" + day;
        
        for (ac3 = 0; ac3 < num_of_cards; ac3 ++) {
            var temp = data.data[ac3];
            // console.log("level 1");
            if (temp.sprint_id != null) {
                // console.log("level 2");
                if (temp.sprint.title == sprint_name && temp.project_id == project_id && 
                    temp.category_name == category_name) {
                    // console.log("level 3");
                    if (temp.updated_at != null) {
                        // console.log("level 4");
                        var updated_date = Tools.date_functions.get_num_date(temp.updated_at);
                        console.log(current_date + " - " + updated_date);
                        var days = Tools.date_functions.subtract_dates(current_date, updated_date);
                        if (Number(temp.updated_at[11] + temp.updated_at[12]) <= 5) days ++;
                        if (isend == false) { 
                            // console.log("level 5");
                            // console.log(days);
                            if (days >= interval && days <= interval + 2) {
                                result ++; 
                            }
                        }
                        else { 
                            // console.log("level 7");
                            if (days >= interval) {
                                result ++; 
                            }
                        }
                    }
                }
            }
        }

        return result;
    },

    get_aging_charts_response: function(data) {

        const num_of_cards = (data.pagination.total <= 100) ? data.pagination.total : 100;
        var response = [];

        var categories_array = ['Ready', 'In Progress', 'In Review'];
        var lengths_array = ['0-1 days', '2-3 days', '4-5 days', '>5 days'];
        var sprint_array = [];
        var lengths_array_helper = [0, 2, 4, 6]

        for (ac0 = 0; ac0 < num_of_cards; ac0 ++) {
            var temp = data.data[ac0];
            if (temp.sprint_id != null) {
                if (!sprint_array.includes(temp.sprint.title)) {
                    sprint_array.push(temp.sprint.title);
                }
            }
        }

        var categories = categories_array.length;
        var lengths = lengths_array.length;
        var sprints = sprint_array.length;

        var counter = 0;

        for (ac0 = 0; ac0 < sprints; ac0++) {
            for (ac1 = 0; ac1 < categories; ac1++) {
                for (ac2 = 0; ac2 < lengths; ac2++) {
                    response[(ac0*categories*lengths) + (ac1*lengths) + ac2] = {
                        'category_name': categories_array[ac1],
                        'length': lengths_array[ac2],
                        'num_of_cards': this.get_cards_in_interval(data, sprint_array[ac0], 
                            this.get_projID_from_sprint_name(data, sprint_array[ac0]), lengths_array_helper[ac2], 
                            (ac2 == lengths - 1), categories_array[ac1]),
                        'sprint_name': sprint_array[ac0],
                        'project_id': this.get_projID_from_sprint_name(data, sprint_array[ac0])
                    }
                    counter++;
                }
            }
        }
        response[0].number = counter;
        return response;
    }

};

exports.functions = methods;



// aging charts [
//     {
//         category-name: The name of the status queue this object is for (ready, waiting, debugging, etc)
//         length: How long the number of cards in the next attribute have been in this category
//         num-of-cards: how many cards have been in this status for the above length of time
//         sprint-name: The name of the sprint in question
//         project-id: The id of the project that this sprint is in
//     }
// ]

// For every category name, we need to loop through all the different possible lengths and make one object for each 

// stacked column plot (https://charts.ant.design/en/examples/column/stacked#column-background)

// 