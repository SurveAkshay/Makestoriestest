const express = require('express');
const fs = require('fs');
const path = require('path');
const User = require('../models/user');
const router = new express.Router();

const imgMiddleware = require('../middleware/imgMiddleware');
const userAuth = require('../middleware/userAuth');

router.post('/user', imgMiddleware.single("photo"), async (req,res) => {
    var user;
    
    const url = req.protocol + '://' + req.get('host');
    // console.log(url)
    if(!req.file) {
        user = new User({
            ...req.body
        })
    } else {
        user = new User({
            ...req.body,
            photo: `${url}/static/${req.file.originalname}`
        })
    }
    try {        
        await user.save();
        const token = await user.generateAuthToken();
        // console.log(user);
        res.status(201).send({user,token});  
    } 
    catch (e) {
        // console.log(e)
        if(e.keyPattern.email) {
            res.status(409).send(e);
        } else {
            res.status(400).send(e);
        }
    }
})

router.post('/user/login', async (req,res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();

        res.send({user, token})
    } catch(e) {
        res.status(400).send()
    }
})

router.get('/user/me', userAuth, async (req, res) => {
    res.send(req.user);
})

router.post('/user/logout', userAuth, async(req,res)=> {
    try {
        req.user.tokens = req.user.tokens.filter( token => token.token !== req.token);
        await req.user.save()
        res.send()
    } catch(e) {
        res.status(500).send();
    }
})


router.post('/user/logoutAll', userAuth, async(req,res)=> {
    try {
        req.user.tokens = [];
        await req.user.save()
        res.status(200).send()
    } catch(e) {
        res.status(500).send();
    }
})

router.patch('/user/me', userAuth, imgMiddleware.single("photo"), async (req,res) => {
    // const id = req.params.id;
    const url = req.protocol + '://' + req.get('host');
    const updates = Object.keys(req.body);
    const allowedUpdates = ['firstName','lastName','age','email','address','photo','phone'];
    const isvalidOperation = updates.every((update) => allowedUpdates.includes(update));
    if(!isvalidOperation) {
        return res.status(400).send({error: 'invalid updates!'})
    }
    if(!req.file) {
        try {
            updates.forEach((update) => req.user[update] = req.body[update])

            await req.user.save();
            
            res.send(req.user);
        } catch (e) {
            console.log(e)
            res.status(400).send(e)
        }
    } else {
        try {            
            updates.forEach((update) => {
                if(req.file) {
                    req.user.photo = `${url}/static/${req.file.originalname}`;
                }
                req.user[update] = req.body[update]
            })

            await req.user.save();
            
            res.send(req.user);
        } catch (e) {
            console.log(e)
            res.status(400).send(e)
        }
    }
})

module.exports = router;