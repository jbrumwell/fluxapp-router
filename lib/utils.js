'use strict';

var _ = require('lodash');

var CHARS = 'qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890';


function genId(length) {
  length = length || 16;

  return _.map(_.range(length), function () {
    return CHARS[_.random(0, CHARS.length-1)];
  }).join('');
}

function findHistoryOffset(id, historyState) {
  var offset = _.findIndex(historyState.history, function(historyEntry) {
    return historyEntry.id === id;
  });

  if (offset !== -1) {
    return historyState.currentIdx - offset;
  } else {
    return null;
  }
}

module.exports = {
  genId : genId,
  findHistoryOffset : findHistoryOffset
};
