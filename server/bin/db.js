var mongoose = require("mongoose");
module.exports = {
    "db":{},
    "setup":function(){
        mongoose.connect("mongodb://localhost/football");
        var db = mongoose.connection;
        db.on("error",console.error.bind(console,"connection error:"));
        db.on("open",()=>{
            console.log("connected to db success");
        });
        this.db = db;
    }
};