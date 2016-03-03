var fs = require('fs');
var path = require('path');
var messages = require('./messages.json');
var CronJob = require('cron').CronJob;
var spawn = require('child_process').spawn;

/*
 *  Getting the file path of .runnrc in user's home folder
 */
function getConfigFilePath() {
    var home = process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME'];
    var filename = '.runnrc';

    return path.join(home, filename);
}

/*
 *  Reading the config file
 */
function readConfigFile(callback) {
    fs.readFile(getConfigFilePath(), callback);
}

function getConfiguration(contents) {
    var config = {
        tasks: []
    };

    try {
        config = JSON.parse(contents);
    } catch(e) {
        contents.split('\r\n').map(function(line) {
            var task = {};

            if (!line) { return; }

            task.time = line.split(' ').slice(0, 6).join(' ');
            task.command = line.split(' ')[6];
            task.args = line.split(' ').slice(7);
            config.tasks.push(task);
        });
    }

    return config;
}

/*
 *  Entry point function
 */
function run() {
    readConfigFile(function(err, contents) {
        var config;

        if (err) {
            switch (err.code) {
                case 'ENOENT':
                    console.log(messages[err.code]);
                    return;
            }
        }

        config = getConfiguration(contents.toString());

        var tasks = config.tasks;
        console.log('Starting ' + tasks.length + ' task' + (tasks.length === 1 ? '' : 's'));
        var job = new CronJob({
            cronTime: tasks[0].time,
            onTick: function() {
                var task = spawn(tasks[0].command, [tasks[0].args]);
                task.stderr.on('data', function(data) {
                    console.log('ERR: ' + data.toString());
                });
                task.stdout.on('data', function(data) {
                    console.log(data.toString());
                });
            },
            start: true
        });
    });
}

run();
