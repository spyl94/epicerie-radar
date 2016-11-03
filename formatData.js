import data from './data3.json'

for (var i = 0; i < data.length; i++) {
    data[i].coords = {
      latitude: parseFloat(data[i].Point.coordinates.split(',')[0]),
      longitude: parseFloat(data[i].Point.coordinates.split(',')[1]),
    };
    delete data[i].ExtendedData;
    delete data[i].Point;

}

var fs = require('fs');
var outputFilename = 'datas2.json';

fs.writeFile(outputFilename, JSON.stringify(data, null, 4), function(err) {
    if(err) {
      console.log(err);
    } else {
      console.log("JSON saved to " + outputFilename);
    }
});
