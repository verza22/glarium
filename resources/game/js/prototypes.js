
import Vue from 'vue'
import Panzoom from '@panzoom/panzoom'
/*
String.prototype.capitalize = function (){
    return this.charAt(0).toUpperCase()+this.slice(1);
}
*/
Vue.prototype.$sectotime = function(secs){
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

Vue.prototype.$zoom = function (){
    const elem = document.getElementById('zoom')
    var panzoom = Panzoom(elem, {
        disablePan:true,
        animate:true,
        step:0.12,
        maxScale: 1,
        minScale: 0.80,
        origin: '0 0',
        setTransform: (elem, { scale, x, y }) => {
            if(panzoom!=undefined){
                panzoom.setStyle('transform', `scale(${scale})`)
            }
        }
    })
    elem.parentElement.addEventListener('wheel', panzoom.zoomWithWheel)
}

Number.prototype.money = function(n, x) {
  var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
  return this.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$&,');
};

Vue.prototype.$money = function (number){
  return number==undefined ? 0 : Math.floor(number).money();
}
Vue.prototype.$money_two = function (number){
  return number==undefined ? 0 : parseFloat(number).money(2);
}
Vue.prototype.$floor = function (number){
  return number==undefined ? 0 : Math.floor(number);
}
