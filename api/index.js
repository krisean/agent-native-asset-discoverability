const condition=String(process.env.EXPERIMENT_CONDITION||'A').toUpperCase();
module.exports=condition==='E'?require('../website/server').app:condition==='B'?require('../website/server-condition-b').app:require('../website/server-condition-a').app;
