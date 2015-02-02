/**
 * Created by capirote on 1/02/15.
 */
var express = require('express');
var i2c = require('i2c-bus'),i2c1;
var sleep = require('sleep');
var met1=0x70;
i2c1 = i2c.openSync(1);

var state={};
state.last=0;
state.med=null;
state.power=0;
rango=0x18;
tiempo=100000;
state.calib=0;
i2c1.writeByteSync(met1,0,rango);



var router = express.Router();

var calibrar=function(){
    i2c1.writeByteSync(met1,0,0x51);
    sleep.usleep(tiempo);
    r1 = i2c1.readByteSync(met1, 0x02);
    r2 = i2c1.readByteSync(met1, 0x03);
    state.calib=r1*10+r2;
}

/* GET users listing. */
router.get('/on', function(req, res, next) {
    state.power=1;
    res.send(state);
});
router.get('/cal', function(req, res, next) {
    calibrar();
    res.send(state);

});
router.get('/off', function(req, res, next) {
    state.power=0;
    res.send(state);
});
router.get('/med', function(req, res, next) {
    state.med=null;
    if (state.power){
    i2c1.writeByteSync(met1,0,0x51);
    sleep.usleep(tiempo);
    r1 = i2c1.readByteSync(met1, 0x02);
    r2 = i2c1.readByteSync(met1, 0x03);
    //console.log("r1: " + r1+ "" +r2 + " cm");
        state.last=new Date();
    state.med=state.calib-(r1*10+r2);
    }
    res.send(state);

});
router.get('/halt', function(req, res, next) {
    state.power=0;
    res.send(state);
    require('child_process').exec('halt -p', console.log)
});
router.get('/reset', function(req, res, next) {
    state.power=0;
    res.send(state);
    require('child_process').exec('reboot', console.log)
});
router.get('/close', function(req, res, next) {
    res.send(state);
    throw("reiniciamos");
    //server.close();
});




calibrar();
module.exports = router;