const condition=String(process.env.EXPERIMENT_CONDITION||'A').toUpperCase();
const apps={E:'../website/server',B:'../website/server-condition-b'};
module.exports=require(apps[condition]||'../website/server-condition-a').app;
