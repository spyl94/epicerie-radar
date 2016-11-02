import data from './data.json'

for (var i = 0; i < data.length; i++) {
  console.log(
    'http://maps.googleapis.com/maps/api/streetview?size=640x480&location='
    + data[i].coords.latitude
    + ','
    + data[i].coords.longitude
    // + '&fov=360&heading=235&pitch=10&sensor=false'
  );
}
