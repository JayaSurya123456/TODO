
const express=require('express');

const mongoose=require('mongoose')

const cors=require('cors')

const app=express();
app.use(express.json())
app.use(cors())


//sample in memory storage for todo item
// let todos=[];


//connecting mongodb
mongoose.connect('mongodb://localhost:27017/mern-app')
.then(()=>{
  console.log('Db Connected')
})
.catch((err)=>{
  console.log(err)
})


// creating schema
const todoSchema=new mongoose.Schema({
  title:{
    required:true,
    type:String
  },

  description:String
})

//creating model
const todoModel=mongoose.model('Todo',todoSchema);


//create a new todoitem
app.post('/todos',async (req,res)=>{
 const {title,description}= req.body;

 
//  const newTodo={
//   id:todos.length+1,
//   title,
//   description
//  }
//  todos.push(newTodo)
//  console.log(todos)


try {
   const newTodo=new todoModel({title,description})
    await newTodo.save();
    res.status(201).json(newTodo)

} catch (error) {
  console.log(error)
  res.status(500).json({Message:error.message})
}


})


//Get All Items
app.get('/todos',async (req,res)=>{

  try {
    const todos = await todoModel.find()
    res.json(todos)
  } catch (error) {
    console.log(error)
    res.status(500).json({Message:error.message})
  }
 
})

// update todo item
app.put('/todos/:id',async (req,res)=>{

  try {
  const {title,description}=req.body;
  const id =req.params.id;

  const updatedTodo=await todoModel.findByIdAndUpdate(
    id,
    {title,description},
    // just return updated value in updatedTodo variable after updated in DB
    {new:true}
  )

  // if no id found updatedTodo value is null so i testing !updatedtOdo is null and
  //  return no data found

  if(!updatedTodo){
    return res.status(404).json({message:"Todo Not found"})
  }
  res.json(updatedTodo)

  }
   catch (error) {
    console.log(error)
    res.status(500).json({Message:error.message})  
  }
})


//Delete a Todo Route
app.delete('/todos/:id', async (req,res)=>{
  try {
  const id=req.params.id;
  await todoModel.findByIdAndDelete(id);
  res.status(204).end();

  } catch (error) {
    console.log(error)
    res.status(500).json({Message:error.message})  
  }
})


// Start The Server
const port=8000;
app.listen(port,()=>{
    console.log("Server iS listening to the "+port)
})