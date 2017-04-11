var mongoose = require('mongoose');
mongoose.connect("mongodb://localhost/football");
var db = mongoose.connection;
db.on('error',console.error.bind(console, 'connection error:'));
db.once('open',()=>{
    console.log("connect success");
});

var teamSchema = mongoose.Schema({
    name:String,
    desc:String
});

var matchSchema = mongoose.Schema({
    home:{
        name:String,
        team_id:{
            type: mongoose.Schema.Types.ObjectId,
            ref:'team'
        }
    },
    away:{
        name:String,
        team_id:{
            type: mongoose.Schema.Types.ObjectId,
            ref:'team'
        }
    },
    score:{
        home:Number,
        away:Number
    }
});

var Team = mongoose.model('team',teamSchema);
var Match = mongoose.model('match',matchSchema);

// var barce = new Team({
//     name:"Barcelona",
//     desc:"testing team"
// });
// barce.save();

// var real = new Team({
//     name:"Real",
//     desc:"testing"
// });
// real.save();

var barcelonaPromise = Team.findOne({
        name:"Barcelona"
    }).exec();

var realmaridPromise = Team.findOne({
    name:"Real"
}).exec();

Promise
    .all([barcelonaPromise,realmaridPromise])
    .then((teams)=>{
        var barcelona = teams[0];
        var realmarid = teams[1];
        var elcasico  = new Match({
            away:{
                name:barcelona.name,
                team_id:barcelona._id
            },
            home:{
                name:realmarid.name,
                team_id:realmarid._id
            },
            score:{
                home:0,
                away:10
            }
        });elcasico.save(); 
    });
