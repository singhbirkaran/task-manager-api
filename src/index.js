const app = require('./app')

const port = process.env.PORT

// app.use((req,res,next) => {
//     res.status(503).send('Site under maintenance')
// })

app.listen(port, () => {
    console.log('Server up on port '+port)})
