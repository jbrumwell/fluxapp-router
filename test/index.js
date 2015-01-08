var router = require('../lib');
router.use(require('fluxapp'));
router.init();

require('./router');
require('./components.jsx');
