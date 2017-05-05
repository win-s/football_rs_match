const express = require('express');
const router = express.Router();
const db = require('../bin/dbCollections');
const moment = require('moment');
const Types = require('mongoose').Schema.Types;
// console.log(db);
var teamsFn = (req,res,next,renderObj)=>{
    let obj = typeof req.query.s === "string" &&  req.query.s !== "" 
                ? {
                    $text:{
                        $search:req.query.s
                   }    
                }
                : {};
    db.Team
        .find(obj)
        .exec((err,teams)=>{
            if(err)return handleError(err);
            Object.assign(renderObj,{
                'teams':teams,
                'title':'Team List'
            });
            res.render('teams',renderObj);
        });
};
router.get('/teams',(req,res,next)=>{
    teamsFn(req,res,next,{});
});
router.get('/teams/edit',(req,res,next)=>{
    teamsFn(req,res,next,{
        mode:'edit'
    });
});
// router.post('/teams/delete',(req,res,next)=>{
//     if (typeof req.body === "object" && req.body.hasOwnProperty("length")){//check for array type
//         req.body.forEach((item)=>{
            
//         });
//     }else{

//     }toString()
// });
router.get('/teams/add-form',(req,res,next)=>{
    res.render("team-add",{
        title:"Add Team"
    });
});

router.get('/teams/add',(req,res,next)=>{
    var newTeam = new db.Team({
        name:req.query.name,
        desc:req.query.desc
    });
    console.log(newTeam);
    newTeam.save((err)=>{
        if(err){
            res.render('error',{
                error:err,
                message:'Can\'t add this team to database.'
            });
            return handleError(err);
        }
        res.render('success',{
            message:"success Adding"
        });
    });
});

router.post('/teams/delete',(req,res)=>{
    var deleteList = req.body.d || [];
    db.Team
        .find({
            _id:{
                $in:deleteList
            }
        })
        .remove()
        .exec( err=>{
            if(err){
                res.render("error",{
                    error:err,
                    message:"Error on deleting team(s)",
                    back:"/football/teams"
                });
                return handleError(err);
            }
            res.render("success",{
                message:"Successfully Deleting",
                back:"/football/teams"
            });
        });
});

router.get('/matchs',(req,res,next)=>{
    db
        .Match
        .find({})
        .exec((err,matchs)=>{
            if(err) return handleError(err);
            
            res.render('matchs',{
                title:'Match Result',
                matchs:matchs
            });
        });
});

router.get('/matchs/add-form',(req,res,next)=>{
    var allTeamPromise = db.Team.find({}).exec();
    allTeamPromise.then((teams)=>{
        res.render('match-form',{
            title:'Add Match Result',
            mode:"add",
            teams:teams,
            match:undefined
        });
    });
});

router.post('/matchs/add',(req,res)=>{
    awayTeam = db.Team.findOne({
        _id:req.body.away
    });
    
    var home = {
        name:req.body.home.split(',')[1],
        team_id:req.body.home.split(',')[0]
    };
    var away ={
        name:req.body.away.split(',')[1],
        team_id:req.body.away.split(',')[0]
    };

    (new db.Match({
        home:{
            name:home.name,
            team_id:home.team_id
        },
        away:{
            name:away.name,
            team_id:away.team_id
        },
        score:{
            home:req.body['home-score'],
            away:req.body['away-score']
        },
        date:moment(req.body['iso-date']).toDate()
    })).save( err=>{
        if(err){
            res.render("error",{
                error:err,
                message:"Error Adding Match",
                back:"/football/matchs"
            });
            return handleError(err);
        }
        res.render("success",{
            message:"Success Adding Match",
            back:"/football/matchs"
        });
    } );

    // res.end(JSON.stringify(req.body));
});

router.post('/matchs/delete',(req,res)=>{
    // res.write( JSON.stringify(req.body) );
    db.Match
        .find({
            _id:{
                $in:req.body['del-items']
            }
        })
        .remove()
        .exec((err,matchs)=>{
            if(err){
                res.render("error",{
                    error:err,
                    message:"Error on deleting",
                    back:"/football/matchs"
                });
                return handleError(err);
            }
        });
});
router.post("/matchs/update",(req,res)=>{
    var item = req.body;
    var home = {
        name: item.home.split(',')[1],
        team_id:item.home.split(',')[0]
    }
    var away = {
        name:item.away.split(',')[1],
        team_id:item.away.split(',')[0]
    }
    var updateItem ={
        home:{
            name:home.name,
            team_id:home.team_id
        },
        away:{
            name:away.name,
            team_id:away.team_id
        },
        score:{
            home:item["home-score"],
            away:item["away-score"]
        },
        date:moment(req.body["iso-date"]).toDate()
    };
    
    db.Match.update({
            '_id':req.body.id
        },
        updateItem,
        err=>{
        if(err){
            res.render("error",{
                error:err,
                back:"/football/match",
                message:"Error on Updating match"
            });
            return handleError(err);
        }
        res.render("success",{
            message:"Success Update",
            back:"/football/matchs"
        });
    });
    
});
router.get("/matchs/update-form",(req,res)=>{
    var allTeamPromise = db.Team.find({}).exec();
    var matchPromise = db.Match
                        .find({
                            _id:req.query.id
                        }).exec();
    Promise
        .all([allTeamPromise,matchPromise])
        .then( data=>{
            var teams = data[0];
            var match = data[1][0] || undefined;
            console.log( JSON.stringify(match) );
            res.render("match-form",{
                title:"Update Match",
                mode:"update",
                teams:teams,
                match:match,
                moment:moment
            });
        });
});
module.exports = router;
