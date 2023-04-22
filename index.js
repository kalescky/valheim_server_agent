const steamServerQuery = require('steam-server-query');
const AWS = require('aws-sdk');

AWS.config.update({region: 'us-west-2'});

function serverQuery() {
  steamServerQuery.queryGameServerInfo('localhost:2457').then(infoResponse => {
    console.log(infoResponse);
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
  }).catch((err) => {
    console.error(err);
  });
}

setInterval(serverQuery,10000)
