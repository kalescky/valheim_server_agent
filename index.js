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
  .option('--interval', 'logging interval')
  .option('--server-name', 'valheim server name')
  .option('--server-port', 'valheim server port')
  .option('--server-world', 'valheim server world')
  .option('--server-password','valheim server password')

program.parse(process.argv);
const options = program.opts();

if (options.run) {
  const command = './'+process.env.VALHEIM_EXECUTABLE;
  const args = [ '-name "'+options.serverName+'"', '-port '+options.serverPort , '-world "'+options.serverWorld+'"', '-password "'+options.serverPassword+'"'];
  console.log(command, args);
  spawn(command, args)
};

if (options.startLogging) {
  AWS.config.update({region: 'us-west-2'});
  var cw = new AWS.CloudWatch({apiVersion: '2010-08-01'});
  if (options.host) { 
    const host = options.host; 
  } else {
    const host = 'locolhost';
  }
  const port = '2457';
  if (options.interval) { 
    const interval = Number(options.interval); 
  } else {
    const interval = 10000;
  }

  setInterval(() => {
    console.log(host,':',port);
    steamServerQuery.queryGameServerInfo(host+":"+port).then(infoResponse => {
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
  }, interval)
  
}

if (options.test) {
  console.log("testing!")
  var val1 = 'test';
  var val2 = 'test1';
  console.log(val1+':'+val2);
}







