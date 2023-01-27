const express=require('express')
const router=new express.Router()
const User=require('../models/users.js')
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')
const { sendWelcomeMail, sendCancelationEmail } = require('../emails/account')

router.post('/users' , async (req,res) => {
    const user=User(req.body)

    try{
        await user.save()
        sendWelcomeMail(user.email, user.name)
        const token = await user.generateAuthToken() 
        res.status(201).send({user,token})
    }catch(e){
        res.status(400).send(e)
    }
})

router.post('/users/login',async(req,res) => {
    try{
        const user=await User.findByCredentials(req.body.email,req.body.password)
        const token = await user.generateAuthToken()
        res.send({user, token})
    }catch(e){
        res.status(400).send(e)
    }
})

router.post('/users/logout', auth, async(req,res) => {
    try{
        req.user.tokens=req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send(e)
    }
})

router.post('/users/logoutall',auth,async(req,res) => {
    try{
        req.user.tokens=[]
        await req.user.save()
        res.send(req.user)
    }catch(e){
        res.status(500).send()
    }
})

router.get('/users/me',auth,async (req,res) => {
    res.send(req.user)
})

// router.get('/users/:id',async (req,res) => {
//     const _id = req.params.id
//     try{
//         const user=await User.findById(_id)
//         if(!user){
//             return res.status(404).send()
//         }
//         res.send(user)
//     }catch(e){
//         res.status(500).send(e)
//     }
// })

router.patch('/users/me',auth,async(req,res) => {
    const updates=Object.keys(req.body)
    const allowedupdates=['name','age','email','password']

    const isValidated = updates.every((update) => allowedupdates.includes(update))
    if (!isValidated){
        return res.status(400).send('Not a valid field')
    }
    try{
        //const user = await User.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
        //const user = await User.findById(req.params.id)
        updates.forEach((update) => req.user[update]=req.body[update])
        await req.user.save()
        // if(!user){
        //     return res.status(400).send()
        // }
        res.send(req.user)
    }catch(e){
        res.status(500).send(e)
    }
})

router.delete('/users/me',auth, async(req,res) => {
    try{
    // const user = await User.findByIdAndDelete(req.params.id)
    // if(!user){
    //     return res.status(404).send('User not found')
    // }

    await req.user.remove()
    sendCancelationEmail(req.user.email, req.user.name)
    res.send('Deleted\n'+req.user)
}catch(e){
    res.status(500).send(e)
}
})

const upload = multer ({

    limits:{
        fileSize: 1000000
    },
    fileFilter(req, file, cb){
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('Please Upload an Image'))
        }
        cb(undefined,true)
    }
})
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({width: 250, height:250}).png().toBuffer()
    req.user.avatars = buffer
    await req.user.save()
    res.send()

},(error,req,res,next) => {
    res.status(400).send({error: error.message})
})

router.delete('/users/me/avatar', auth, async (req,res) => {
    try{
        req.user.avatars = undefined
        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send(e)
    }
})

//get image by user id
router.get('/users/:id/avatar', async (req, res) => {
    try{
        const user = await User.findById(req.params.id)

        if (!user || !user.avatars){
            throw new Error()
        }

        res.set('Content-Type', 'image/png')
        res.send(user.avatars)
    }catch(e){
        res.status(404).send(e)
    }
})


module.exports=router