const request = require('request');
const fs = require('fs');
const readline = require('readline');

const args = process.argv.slice(2);
const URL = args[0];
const PATH = args[1];

const rl = readline.createInterface(process.stdin, process.stdout);

request(URL, (reqErr, response, body) => {
  if (reqErr) {
    console.error("Invalid URL");
    process.exit();
  }
  fs.exists(PATH, function(isExist) {
    if (isExist) {
      rl.question(`${PATH} is not empty. Would you like to overwrite? Type 'y' for yes: `, answer => {
        if (answer !== 'y') {
          console.log("Exiting program...");
          process.exit();
        } else {
          fs.writeFile(PATH, body, writeErr => {
            if (writeErr) {
              console.error("Path is not valid.");
              process.exit();
            }
            fs.stat(PATH, (statErr, stats) => {
              if (statErr) {
                console.error("Unable to read file statistics.");
                process.exit();
              } else {
                console.log(`Downloaded and saved ${stats.size} bytes to ${PATH}`);
                rl.close();
              }
            })
          })
        }
      })
    } else {
      fs.writeFile(PATH, body, writeErr => {
        if (writeErr) {
          console.error("Path is not valid.");
          process.exit();
        }
        fs.stat(PATH, (statErr, stats) => {
          if (statErr) {
            console.error("Unable to read file statistics.");
            process.exit();
          } else {
            console.log(`Downloaded and saved ${stats.size} bytes to ${PATH}`);
            rl.close();
          }
        })
      })
    }

  })
});