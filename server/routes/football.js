var express = require('express');
var router = express.Router();
var db = require('../bin/dbCollections');
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
router.post('/teams/delete',(req,res,next)=>{
    if (typeof req.body === "object" && req.body.hasOwnProperty("length")){//check for array type
        req.body.forEach((item)=>{
            
        });
    }else{

    }
});
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
    
    newTeam.save((err)=>{
        if(err){
            res.render('error',{
                error:err,
                message:'Can\'t add this team to database.'
            });
        }
        res.render('success',{

        });
    });
});

module.exports = router;