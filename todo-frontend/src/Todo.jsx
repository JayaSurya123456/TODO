import { useEffect, useState } from "react"

export default function Todo(){

    const [title,setTitle]=useState("")
    const [description,setDescription]=useState("")
    const [todos,setTodos]=useState([])
    const [error,setError]=useState("")
    const [message,setMessage]=useState("")
    const [editId,setEditId]=useState(-1)
    const [editTitle,setEditTitle]=useState("")
    const [editDescription,setEditDescription]=useState("")


    // const apiUrl="http://localhost:8000"

    const apiUrl="https://todo-v3c8.onrender.com"

    const handleSubmit=()=>{

        //clear error message when submit button click again
        setError("")
        //check inputs
        if(title.trim() !== '' && description.trim() !== ''){
            
            fetch(apiUrl+"/todos",{
                method:"POST",
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({title,description})
            }).then((res)=>{  
                if(res.ok){
                 // add item to list
                 setTodos([...todos,{title,description}])
                 setTitle("")
                 setDescription("")
                 setMessage("Item Added Successfully") 
                 setTimeout(()=>{
                    setMessage("")
                 },3000)
                }
                else{
                    //res not ok else error
                 setError("Unable To create Todo Item")

                }
            }).catch(()=>{
                //common error fetch from api backend
                setError("Unable To create Todo Item")
            })
        }
    }


    const getItems=()=>{
        fetch(apiUrl+"/todos")
        .then((res)=>{
            return res.json()
        })
        .then((res)=>{
            setTodos(res)
        })
    }

    useEffect(()=>{
        getItems()
    },[])

    const handleEdit=(item)=>{
        setEditId(item._id)
        setEditTitle(item.title)
        setEditDescription(item.description)
        
    }

    const handleUpdate=()=>{
        
        //clear error message when submit button click again
        setError("")
        //check inputs
        if(editTitle.trim() !== '' && editDescription.trim() !== ''){
            
                fetch(apiUrl+"/todos/"+editId, {
                method:"PUT",
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({title:editTitle,description:editDescription})

            }).then((res)=>{

                if(res.ok){
                 // Update item to list
                 const updatedTodos=todos.map((item)=>{
                  if(item._id == editId){
                    item.title=editTitle;
                    item.description=editDescription;
                  }
                  return item;
                 })


                 setTodos(updatedTodos)
                
                 setMessage("Item Updated Successfully") 
                 setTimeout(()=>{
                    setMessage("")
                 },3000)

                 setEditId(-1)
                }
                else{
                    //res not ok else error
                 setError("Unable To create Todo Item")

                }
            }).catch(()=>{
                //common error fetch from api backend
                setError("Unable To create Todo Item")
            })
        }

    }

    const handleEditCancel=()=>{
        setEditId(-1)
    }

  const handleDelete=(id)=>{
    if(window.confirm('Are You Sure To Delete ')){
            fetch(apiUrl+'/todos/'+id, {
            method:"DELETE"
        })
        .then(()=>{
          const updatedTodos = todos.filter((item)=> item._id !==id)
          setTodos(updatedTodos)
        })
    }
  }
    return<>

    <div className="row p-3 bg-success text-light">
        <h1>Todo Project with MERN Stack</h1>
    </div>

    <div className="row">
        <h3>Add Item</h3>
        {message && <p className="text-success">{message}</p>}
    <div className="form-group d-flex gap-2">
    <input onChange={(e)=>setTitle(e.target.value)} value={title} placeholder="Title" className="form-control" type="text" />
    <input onChange={(e)=>setDescription(e.target.value)} value={description} placeholder="Description" className="form-control" type="text" />
    <button onClick={handleSubmit} className="btn btn-dark">Submit</button>
        </div>
        {error &&<p className="text-danger">{error}</p>}
    </div>

    <div className="row mt-3">
        <h3>Tasks</h3>

        <ul className="list-group">
            {
           todos.map((item)=>
   <li className="bg-info my-2 align-items-center list-group-item d-flex justify-content-between">
   <div className="d-flex flex-column me-2"> 

              {
        editId ==-1 || editId!==item._id ?<>
        <span className="fw-bold">{item.title}</span>
        <span >{item.description}</span>
         </>:<>

        <div className="form-group d-flex gap-2">
        <input onChange={(e)=>setEditTitle(e.target.value)} value={editTitle} placeholder="Title" className="form-control" type="text" />
        <input onChange={(e)=>setEditDescription(e.target.value)} value={editDescription} placeholder="Description" className="form-control" type="text" />
                </div>
                </>
              }
           
            </div>

            <div className="d-flex gap-2"> 
    { editId ==-1 || editId!==item._id ?<button className="btn btn-warning" onClick={()=>handleEdit(item)}>Edit</button>
    :<button onClick={(handleUpdate)}>Update</button>}

        
              { editId ==-1 ? <button onClick={()=>handleDelete(item._id)} className="btn btn-danger">Delete</button>:
            <button onClick={handleEditCancel} className="btn btn-danger">Cancel</button>}

            </div>
            </li>
            )
        }
        </ul>
    </div>
    </>
    
}

