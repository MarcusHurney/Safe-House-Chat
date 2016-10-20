const moment = require('moment');


var generateMessage = (from='Anonymouse', text="No text") => {
  return { from, text, createdAt: moment().valueOf() };
};

var generateLocationMessage = (from, latitude, longitude) => {
  return {
    from,
    url:`https://www.google.com/maps?q=${latitude},${longitude}`,
    createdAt: moment().valueOf()
  };
};

module.exports = { generateMessage, generateLocationMessage };
