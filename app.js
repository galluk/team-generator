const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const Render = require("./lib/htmlRenderer");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");
const util = require("util");

const OUTPUT_DIR = path.resolve(__dirname, "output");

const writeFileAsync = util.promisify(fs.writeFile);

class Generator {
    constructor() {
        this.team = [];//  array of team members
        this.id = 0;
    }

    // auto generate ids
    getId() {
        this.id++;
        return this.id;
    }

    // called from main function to build team
    buildTeam() {
        this.getManagerDetails().then(() => {
            console.log("Please enter each of your team members...");
            this.getMemberDetails().then(() => {
                this.askForMember();
            })
        })
    }

    // uses inquirer to get the details of the engineer/intern - does both
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
                        // create and add the Engineer
                        member = new Engineer(answer.mem_name, this.getId(), answer.mem_email, answer.mem_github);
                        this.team.push(member);
                        break;
                    case "Intern":
                        // create and add the intern 
                        member = new Intern(answer.mem_name, this.getId(), answer.mem_email, answer.mem_school);
                        this.team.push(member);
                        break;
                    default:
                        console.log("There was an error with entered data. Please re-enter.");
                }
            });
    }

    // uses inquirer to get the details of the manager
    getManagerDetails() {
        console.log("Please enter the Manager's Details");

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
                //  and add to the team
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
                    // recursively ask for team members
                    this.getMemberDetails().then(() => {
                        this.askForMember();
                    })
                } else {
                    this.saveHTML();
                }
            });
    }

    // generate and save the html once the user has finished entering team
    saveHTML() {
        // use provided function to generate the html
        let teamHTML = Render(this.team);

        // before writing ensure the output directory exists
        let bFolderExists = fs.existsSync(OUTPUT_DIR);
        if (!bFolderExists) {
            // doesn't exist so create        
            bFolderExists = (fs.mkdirSync(OUTPUT_DIR, { recursive: true }) !== "");
        }

        if (bFolderExists) {
            // and finally save the html
            writeFileAsync(`${OUTPUT_DIR}/team.html`, teamHTML)
                .then(() => {
                    console.log(`Successfully created team webpage at : ${OUTPUT_DIR}/team.html`);
                    process.exit(0);
                })
                .catch(() => {
                    console.log(`Unable to save webpage file at : ${OUTPUT_DIR}/team.html`);
                    process.exit(0);
                });
        } else {
            console.log('Unable to create output directory. The team.html file was not saved.');
        }
    }
}

function init() {
    console.log("Welcome to the Team Generator app!");
    console.log("Please provide information for each team member. \nA Manager is required, then multiple Engineers and Interns can be added.");

    let teamGenerator = new Generator();
    teamGenerator.buildTeam();
}

init();