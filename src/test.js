const {performance} = require('perf_hooks');
const {init, interceptionStrategyNames} = require('./server');
const {post} = require('./helper');
let i = 0;

(async function test() {
  await init();

  (function postDummyData() {
    const category = i % 4 < 2 ? 'MAIN' : 'RENDERER';
    const subcategory = (i % 4 === 0 || i % 4 === 3) ? 'send' : 'on';
    const channel = String(i % 16 < 8 ? 11 : 12);
    const toSend = {
      category,
      subcategory,
      channel,
      timestamp: performance.now(),
      interceptionStrategy: subcategory === 'send'
        ? interceptionStrategyNames.send
        : interceptionStrategyNames.on,
    };
    post(toSend);
    i++;
    setTimeout(postDummyData, 500);
  })();
})();
