var mongoose = require("mongoose");
var Types = mongoose.Schema.Types;

var TeamSchema = mongoose.Schema({
    name:String,
    desc:String
});
var Team = mongoose.model("team",TeamSchema);

var matchSchema = mongoose.Schema({
    home:{
        name:String,
        team_id:{
            type:Types.ObjectId,
            ref:"team"
        }
    },
    away:{
        name:String,
        team_id:{
            type:Types.ObjectId,
            ref:"team"
        }
    },
    score:{
        home:Number,
        away:Number
    },
    date:Types.Date
});
var Match = mongoose.model("match",matchSchema);

module.exports = {
    "Team" : Team,
    "Match" : Match
};