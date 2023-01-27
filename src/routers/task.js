const express=require('express')
const router=new express.Router()
const Tasks=require('../models/tasks')
const auth = require('../middleware/auth')

router.post('/tasks', auth, async (req,res) => {
    //const task=Tasks(req.body)
    const task = new Tasks({
        ...req.body,
        owner: req.user._id
    })
    try{
        await task.save()
        res.status(201).send(task)
    }catch(e){
        res.status(400).send(e)
    }
    
})


router.get('/tasks', auth, async(req,res) => {
    const comp={}
    if(req.query.completed){
        comp.completed = req.query.completed === 'true'
    }
    const options = {
        limit:10, 
        skip:0,
        sort: {}
    }
    if (req.query.limit){
        options.limit = parseInt(req.query.limit)
    }
    if (req.query.skip){
        options.skip = parseInt(req.query.skip)
    }
    if (req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        options.sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }
    try{   
            const tasks=await Tasks.find({...comp, owner: req.user._id},null,options)
            res.send(tasks)   
    }catch(e){
        res.status(500).send(e)
    }
})

router.get('/tasks/:id', auth, async(req,res) => {
    try{
        //const task = await Tasks.findById(req.params.id)
        const task = await Tasks.findOne({ _id:req.params.id, owner: req.user._id})
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    }catch(e){
        res.status(500).send(e)
    }
})

router.patch('/tasks/:id', auth, async(req,res) => {
    const updates=Object.keys(req.body)
    const allowedupdates=['description','completed']

    const isValidated = updates.every((update) => allowedupdates.includes(update))
    if (!isValidated){
        return res.status(400).send('Not a valid field')
    }
    try{
        //const task = await Tasks.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
        //const task = await Tasks.findById(req.params.id)
        const task = await Tasks.findOne({_id:req.params.id, owner: req.user._id})
        if(!task){
            return res.status(404).send()
        }
        updates.forEach((update) => task[update]=req.body[update])
        await task.save()
        res.send(task)
    }catch(e){
        res.status(500).send(e)
    }
})

router.delete('/tasks/:id',auth, async(req,res) => {
    try{
    //const task = await Tasks.findByIdAndDelete(req.params.id)
    const task = await Tasks.findOneAndDelete({_id: req.params.id, owner: req.user._id})
    if(!task){
        return res.status(404).send('task not found')
    }
    res.send(task)
}catch(e){
    res.status(500).send(e)
}
})


module.exports=router