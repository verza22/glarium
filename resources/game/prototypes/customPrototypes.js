

String.prototype.capitalize = function (){
    return this.charAt(0).toUpperCase()+this.slice(1);
}

Number.prototype.sectotime = function(){
  var secs = this;
  var minutes = Math.floor(secs / 60);
  secs = secs%60;
  var hours = Math.floor(minutes/60)
  minutes = minutes%60;
  var res = '';
  if(hours!=0)
    res+=pad(hours)+'h ';
  if(minutes!=0)
    res+=pad(minutes)+'m ';
  res+=pad(secs)+'s';
  return res;
}

function pad(num) {
    return ("0"+num).slice(-2);
}