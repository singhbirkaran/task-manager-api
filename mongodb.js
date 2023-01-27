
const mongodb=require('mongodb')
const MongoClient=mongodb.MongoClient
const ObjectID = mongodb.ObjectId

const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

MongoClient.connect(connectionURL, {useNewUrlParser: true}, (error,client) => {
    if(error){
        return console.log('error connecting')
    }

    const db = client.db(databaseName)

    // db.collection('users').insertOne({
    //     name : 'Birkaran',
    //     age: 23
    // })

    // db.collection('tasks').insertMany([{
    //     description:'walking',
    //     completed:true
    // },
    // {
    //     description:'praying',
    //     completed: false
    // },
    // {
    //     description: 'study',
    //     completed: true
    // }], (err,result) => {
    //     if (err){
    //         return console.log('error',err)
    //     }
    //     console.log(result)
    // })

    // db.collection('users').findOne({_id: new ObjectID("63cd2cd0f141cb01c96ce4f7")}, (err,user) => {
    //     console.log(user)
    // })

    // db.collection('tasks').find({completed: true}).toArray((err,users) => {
    //     console.log(users)
    // })


    //Update
    // db.collection('tasks').updateMany({
    //     completed:false
    // },{
    //     $set: {
    //         completed: true
    //     }
    // }).then((result) => {
    //     console.log('success',result)
    // }).catch((error) => {
    //     console.log('error',error)
    // })

    //delete

//     db.collection('tasks').deleteOne(
//         {_id: new ObjectID("63ce147ed00f71cf10935db4")}
        
    

//     ).then((result) => {
//         console.log(result)
//     }).catch((error) => {
//         console.log('error', error)
//     })

    
})