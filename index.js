const steamServerQuery = require('steam-server-query');
const AWS = require('aws-sdk');
const { Command } = require('commander');
const { spawn } = require('child_process');

require('dotenv').config()
const program = new Command();
program
  .option('-r, --run', 'run ')
  .option('-l, --start-logging', 'start cloudwatch metric collection')
  .option('-t, --test', 'test command')
  .option('-h, --host <ip-address>', 'ip for host if not running local. default is localhost')
  .option('--interval <ms>', 'logging interval')
  .option('--server-name <name>', 'valheim server name')
  .option('--server-port <port>', 'valheim server port')
  .option('--server-world <world>', 'valheim server world')
  .option('--server-password <password>','valheim server password')

program.parse(process.argv);
const options = program.opts();

if (options.run) {
  const valheim_executable = process.env.VALHEIM_EXECUTABLE;
  const args = [ '-name "'+options.serverName+'"', '-port '+options.serverPort , '-world "'+options.serverWorld+'"', '-password "'+options.serverPassword+'"'];
  console.log(valheim_executable, args);
  const command = spawn(valheim_executable, {detached: true, stdio: 'ignore'});
  command.unref();
};  

if (options.startLogging) {
  AWS.config.update({region: 'us-west-2'});
  var cw = new AWS.CloudWatch({apiVersion: '2010-08-01'});

  setInterval(() => {
    steamServerQuery.queryGameServerInfo('localhost:2457').then(infoResponse => {
      console.log(infoResponse);
      var params = {
        MetricData: [
        {
            MetricName: 'Connection Count',
            Dimensions: [
            {
                Name: "World",
                Value: infoResponse.map
            },
            ],
            Unit: 'Count',
            Value: infoResponse.players
        },
        ],
        Namespace: 'Valheim'
    };
  
    cw.putMetricData(params, function(err, data) {
        if (err) {
        console.log("Error", err);
        } else {
        console.log("Success", JSON.stringify(data));
        }
    }); 
    }).catch((err) => {
      console.error(err);
    });
  }, 10000);
  
}

if (options.test) {
  console.log("testing!")
  var val1 = 'test';
  var val2 = 'test1';
  console.log(val1+':'+val2);
}







