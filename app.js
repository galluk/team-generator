const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");


class Generator {
    constructor() {
        this.team = [];//  array of team members
        this.id = 0;
    }

    getId() {
        this.id++;
        return this.id;
    }

    // called from main function to build team
    buildTeam() {
        this.getManagerDetails().then(() => {
            console.log("please enter each of your team members...");
            this.getMemberDetails().then(() => {
                this.askForMember();
            })
        })
    }

    getMemberDetails() {
        return inquirer
            .prompt([
                {
                    name: "mem_name",
                    type: "input",
                    message: "Enter the team member's name:",
                    validate: val => (val.trim() !== ""),
                },
                {
                    name: "mem_email",
                    type: "input",
                    message: "Enter the team member's email address:",
                    validate: val => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(val),
                },
                {
                    name: "mem_type",
                    type: "list",
                    message: "Select the type of team member:",
                    choices: ["Engineer", "Intern"]
                },
                {
                    name: "mem_github",
                    type: "input",
                    message: "Enter the Engineer's github name:",
                    when: (answer) => answer.mem_type === "Engineer",
                    validate: val => (val.trim() !== ""),
                },
                {
                    name: "mem_school",
                    type: "input",
                    message: "Enter the Intern's school:",
                    when: (answer) => answer.mem_type === "Intern",
                    validate: val => (val.trim() !== ""),
                }
            ])
            .then((answer) => {
                let member = null;

                switch (answer.mem_type) {
                    case "Engineer":
                        // create the Engineer
                        member = new Engineer(answer.mem_name, this.getId(), answer.mem_email, answer.mem_github);
                        this.team.push(member);
                        break;
                    case "Intern":
                        member = new Intern(answer.mem_name, this.getId(), answer.mem_email, answer.mem_school);
                        this.team.push(member);
                        break;
                    default:
                        console.log("There was an error with entered data. Please re-enter.");
                }
            });
    }

    getManagerDetails() {
        console.log('getManagerDetails');

        return inquirer
            .prompt([
                {
                    name: "man_name",
                    type: "input",
                    message: "Enter the Manager's name:",
                    validate: val => (val.trim() !== ""),
                },
                {
                    name: "man_email",
                    type: "input",
                    message: "Enter the Manager's email address:",
                    validate: val => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(val),
                },
                {
                    name: "man_office",
                    type: "number",
                    message: "Enter the Manager's office number:",
                    validate: val => /[0-9]+/gi.test(val),
                },
            ])
            .then((answer) => {
                // create the manager
                let manager = new Manager(answer.man_name, this.getId(), answer.man_email, answer.man_office);
                this.team.push(manager);
            });
    }

    // asks the user if they want to enter another member
    askForMember() {
        inquirer
            .prompt([
                {
                    type: "confirm",
                    name: "choice",
                    message: "Enter another team member?"
                }
            ])
            .then(answer => {
                if (answer.choice) {
                    this.getMemberDetails().then(() => {
                        this.askForMember();
                    })
                } else {
                    console.log('Finished entering members:\n' + JSON.stringify(this.team));

                    this.processMembers();
                }
            });
    }

    // Logs goodbye and exits the node app
    processMembers() {
        // user has finished entering team so display it

        // load the files into a string (for each of manager, engineer and intern)

        // for each member in team, replace the placeholders in the html with the values
        // and add it to the team html str

        // replace the {{ team }} placeholder with the gnerated str of all team members

        // and finally save and open the main html

        console.log("\nGoodbye!");
        process.exit(0);
    }
}

// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

function init() {
    console.log("Welcome to the Team Generator app!");
    console.log("As manager, please provide your team's information.");

    teamGenerator = new Generator();
    teamGenerator.buildTeam();
}

// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```

init();