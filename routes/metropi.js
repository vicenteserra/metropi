/**
 * Created by capirote on 1/02/15.
 */
var express = require('express');
var i2c = require('i2c-bus'),i2c1;
var sleep = require('sleep');
var met1=0x70;
i2c1 = i2c.openSync(1);

//var USEC=0x52;
//var CONSTUSEC=2.941176471;
//var CONSTUSEC=3.02;

//var CM=0x51;
var CONSTUSEC=1.785;//3.02;
var USEC={
    init:0x52,
    conv:function(med) {
        return med*CONSTUSEC/100;
    }
}

var CM={
    init:0x51,
    conv:function(med){
        return med;
    }
}

var MODO=CM;
var state={};
state.last=0;
state.med=null;
state.power=0;
state.usec=CONSTUSEC;
//rango=0x18; //107.5cm
rango=0x12; //81.7cm
tiempo=100000;
state.calib=0;
state.r1=0;
state.r2=0;
state.r3=0;
i2c1.writeByteSync(met1,0,rango);



var router = express.Router();

var calibrar=function(){
    i2c1.writeByteSync(met1,0,MODO.init);
    sleep.usleep(tiempo);
    r1 = i2c1.readByteSync(met1, 0x02);
    r2 = i2c1.readByteSync(met1, 0x03);
    //state.calib= r1*10+r2;

    state.r3=r1 << 8 | r2;
    state.calib=MODO.conv(state.r3);
    state.r1=r1;
    state.r2=r2;
}

/* GET users listing. */
router.get('/on', function(req, res, next) {
    state.power=1;
    res.send(state);
});
router.get('/cal', function(req, res, next) {
    calibrar();
    state.usec=CONSTUSEC;
    res.send(state);

});
router.get('/off', function(req, res, next) {
    state.power=0;
    res.send(state);
});
router.get('/med', function(req, res, next) {
    state.med=null;
    if (state.power){
    i2c1.writeByteSync(met1,0,MODO.init);
    sleep.usleep(tiempo);
    r1 = i2c1.readByteSync(met1, 0x02);
    r2 = i2c1.readByteSync(met1, 0x03);
    //console.log("r1: " + r1+ "" +r2 + " cm");
        state.last=new Date();
    //state.med=state.calib-(r1*10+r2);
    state.r3=r1 << 8 | r2;
    state.med=state.calib - MODO.conv(state.r3);
    state.med=state.med.toFixed(2);
    state.usec=CONSTUSEC;
    state.r1=r1;
    state.r2=r2;

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
router.get('/cm', function(req, res, next) {
    MODO=CM;
    res.send(state);
});
router.get('/usec', function(req, res, next) {
    MODO=USEC;
    res.send(state);
});
router.post('/usec',function(req,res,next){
    //console.log(req);
    CONSTUSEC=parseFloat(req.body.usec);
    state.usec=CONSTUSEC;
    res.send(state);
});


calibrar();
module.exports = router;