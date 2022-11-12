
let dataGenerator = (labels, keys = ['value'], min = 10, max = 50) => {
  return labels.map(label => {
    let d = {
      label: label
    };
    keys.map(key => {
      d[key] = Math.floor(Math.random() * (max - min + 1) + min);
    });
    // console.log(d);
    return d;
  });
};
function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
function formatDate(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  return [year, month, day].map(formatNumber).join('-')
}
function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}
function formatDateaddMonth(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 2
  var day = date.getDate()
  date.setMonth(date.getMonth() + 1);
  date.setDate(0);//最大天数
  if(day > date.getDate()){
      day = date.getDate();
  } 
  

  return [year, month, day].map(formatNumber).join('-')
}
function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime: formatTime,
  formatDate: formatDate,
  formatDateaddMonth: formatDateaddMonth,
  dataGenerator: dataGenerator
}
