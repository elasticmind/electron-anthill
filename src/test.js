const {performance} = require('perf_hooks');
const {init, interceptionStrategyNames} = require('./server');
const {post} = require('./helper');
let i = 0;

init();

(function postDummyData() {
  const category = `category ${i % 4 < 2 ? 1 : 2}`;
  const subcategoryNumber = i % 2 === 0 ? 1 : 2;
  const subcategory = `subcategory ${subcategoryNumber}`;
  const channel = `channel ${i % 8 < 4 ? 1000 : 2}`;
  const toSend = {
    category,
    subcategory,
    channel,
    timestamp: performance.now(),
    interceptionStrategy: subcategoryNumber === 1
      ? interceptionStrategyNames.send
      : interceptionStrategyNames.on,
  };
  post(toSend);
  i++;
  setTimeout(postDummyData, 500);
})();
