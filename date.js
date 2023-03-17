exports.getDate=function() {
  var today= new Date();
  var options={ weekday:"long", day:"numeric", month:"long"};
  var day=today.toLocaleString("en-US",options);
  return day;
};