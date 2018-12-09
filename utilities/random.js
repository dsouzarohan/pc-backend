randomString = () => {
  return (Math.random()*new Date().getTime()).toString(36).substr(0,7);
};

module.exports = {
  randomString
};