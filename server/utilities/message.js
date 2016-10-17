var generateMessage = (from='Anonymouse', text="No text") => {
  return { from, text, createdAt: new Date().getTime() };
};

module.exports = { generateMessage };
