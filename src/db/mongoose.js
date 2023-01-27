const mongoose=require('mongoose')
mongoose.set('strictQuery', true)
mongoose.connect(process.env.MONGODB_URL,{
    useNewUrlParser:true,
    
})

// const Tasks= require('../models/tasks')
// const deleteTaskAndCount = async (id) => {
//     const task = await Tasks.findByIdAndDelete(id)
//     const count = await Tasks.countDocuments({completed: false})
//     return count
// }

// deleteTaskAndCount("63ce54ab6d35cd0c568abd1c").then((res) => {
//     console.log(res)
// }).catch((e) => {
//     console.log(e)
// })
