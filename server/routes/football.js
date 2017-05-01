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
            if(err) return handleError(err);
            res.end( JSON.stringify( req.body ) );
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
        res.render('match-add',{
            title:'Add Match Result',
            teams:teams
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
    })).save();
    res.end(JSON.stringify(req.body));
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
            res.end( JSON.stringify(matchs));
        });
});

module.exports = router;
