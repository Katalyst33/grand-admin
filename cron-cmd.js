/**
* XpresserJs Autogenerated CronJob ProcessManager
*
* Runs the `command` declared above to start your cron jobs in a child processes.
*/
const ProcessManager = require('xpresser/src/Console/ProcessManager');
const processManager = new ProcessManager(__dirname);

// Cron Command
const command = 'xjs cron cmd --prod';

// Runs command, Stores process id in storage/framework/console/processes.json
processManager.addCommandProcess(__filename, command);