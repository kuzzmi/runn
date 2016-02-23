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

        try {
            config = JSON.parse(contents);
        } catch (e) {
            if (e instanceof SyntaxError) {
                console.log(e);
                console.log(messages.BADCFG);
                return;
            }
        }

        var tasks = config.tasks;
        var job = new CronJob({
            cronTime: tasks[0].when,
            onTick: function() {
                var task = spawn(tasks[0].what.cmd, [tasks[0].what.args]);
                task.stderr.on('data', function(data) {
                    console.log('ERR: ' + data);
                });
                task.stdout.on('data', function(data) {
                    console.log(data);
                });
            },
            start: true
        });
    });
}

run();
