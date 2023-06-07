/**
 * You first need to create a formatting function to pad numbers to two digits…
 **/
function twoDigits(d) {
  if (0 <= d && d < 10) return '0' + d.toString();
  if (-10 < d && d < 0) return '-0' + (-1 * d).toString();
  return d.toString();
}

/**
 * …and then create the method to output the date string as desired.
 * Some people hate using prototypes this way, but if you are going
 * to apply this to more than one Date object, having it as a prototype
 * makes sense.
 **/
function toMysqlFormat(date) {
  return (
    date.getFullYear() +
    '-' +
    twoDigits(1 + date.getMonth()) +
    '-' +
    twoDigits(date.getDate()) +
    ' ' +
    twoDigits(date.getHours() + 0) + // plus 5 hour for local pakistan time
    //twoDigits(date.getHours()) + // plus 5 hour for local pakistan time
    ':' +
    twoDigits(date.getMinutes()) +
    ':' +
    twoDigits(date.getSeconds())
  );
}

module.exports = toMysqlFormat;
