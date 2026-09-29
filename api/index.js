const condition=String(process.env.EXPERIMENT_CONDITION||'A').toUpperCase();
module.exports=condition==='E'?require('../website/server').app:require('../website/server-condition-a').app;
