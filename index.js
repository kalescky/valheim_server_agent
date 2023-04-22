const steamServerQuery = require('steam-server-query');
const AWS = require('aws-sdk');

AWS.config.update({region: 'REGION'});

steamServerQuery.queryGameServerInfo('localhost:2457').then(infoResponse => {
  console.log(infoResponse);
}).catch((err) => {
  console.error(err);
});


// Create CloudWatch service object
var cw = new AWS.CloudWatch({apiVersion: '2010-08-01'});

// Create parameters JSON for putMetricData
var params = {
  MetricData: [
    {
      MetricName: 'SERVER',
      Dimensions: [
        {
          Name: "WORLD",
          Value: infoResponse.map
        },
      ],
      Unit: 'Count',
      Value: infoResponse.players
    },
  ],
  Namespace: 'VALHEIM'
};

cw.putMetricData(params, function(err, data) {
  if (err) {
    console.log("Error", err);
  } else {
    console.log("Success", JSON.stringify(data));
  }
}); 