
module.exports = function(router) {
  return {
    Link : require('./Link.jsx')(router),
    Form : require('./Form.jsx')(router)
  };
};
