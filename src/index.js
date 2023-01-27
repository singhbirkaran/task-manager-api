const express=require('express')
require('./db/mongoose.js')
const userRouter=require('./routers/user')
const taskRouter=require('./routers/task')

const app = express()
const port = process.env.PORT

// app.use((req,res,next) => {
//     res.status(503).send('Site under maintenance')
// })

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
    console.log('Server up on port '+port)})