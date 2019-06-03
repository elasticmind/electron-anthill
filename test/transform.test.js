const {describe, it} = require('mocha');
const transformUtils = require('../src/utils/transform');
// import * as assert from 'assert';

describe('transformUtils', function() {
  describe('getSimplifiedData', function() {
    it('should return 0 for inverses', function() {
      console.log(redundantEventsInSeparateCategories());
      console.log(redundantEventsBetweenCategories());

      console.log(JSON.stringify(transformUtils.getSimplifiedData(nonRedundantEventsBetweenCategories()), null, 2));
    });
  });
});

/* ON
  category,
  subcategory,
  channel,
  timestamp: performance.now(),
  interceptio
*/

/* SEND
  category,
  subcategory,
  channel,
  payload,
  timestamp: performance.now(),
  interceptionStrategy: interceptionStrategyNames.send
*/
const category1 = 'category1';
const category2 = 'category2';
const subcategory1 = 'subcategory1';
const subcategory2 = 'subcategory2';
const channel1 = 'channel1';
const channel2 = 'channel2';

function event(category, subcategory, channel) {
  return {
    category,
    subcategory,
    channel,
  };
}

function redundantEventsInSeparateCategories() {
  return [
    event(category1, subcategory1, channel1),
    event(category1, subcategory2, channel1),
    event(category2, subcategory1, channel1),
    event(category2, subcategory2, channel1),
    event(category1, subcategory1, channel1),
    event(category1, subcategory2, channel1),
    event(category2, subcategory1, channel1),
    event(category2, subcategory2, channel1),
  ];
}

function redundantEventsBetweenCategories() {
  return [
    event(category1, subcategory1, channel1),
    event(category2, subcategory2, channel1),
    event(category2, subcategory1, channel1),
    event(category1, subcategory2, channel1),
    event(category1, subcategory1, channel1),
    event(category2, subcategory2, channel1),
    event(category2, subcategory1, channel1),
    event(category1, subcategory2, channel1),
  ];
}

function nonRedundantEventsBetweenCategories() {
  return [
    event(category1, subcategory1, channel1),
    event(category2, subcategory2, channel1),
    event(category2, subcategory1, channel2),
    event(category1, subcategory2, channel2),
    event(category1, subcategory1, channel2),
    event(category2, subcategory2, channel2),
    event(category2, subcategory1, channel1),
    event(category1, subcategory2, channel1),
  ];
}
