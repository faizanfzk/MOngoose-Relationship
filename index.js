const express=require("express")
const mongoose=require("mongoose")

const app=express();
app.use(express.json())
const connect=()=>{
    return mongoose.connect("mongodb+srv://faizanfzk:faizan123@cluster0.tnlf5.mongodb.net/libraryManagement?retryWrites=true&w=majority");
}
//user Schema

const userSchema =new mongoose.Schema({
    firstName:{type:String,required:true},
    lastName:{type:String,required:true},
},
    {
       timestamps:true,
       versionKey:false
})

const User=mongoose.model("user",userSchema)
//Section Schema

const sectionSchema=new mongoose.Schema({
    name:{type:String,required:true},
    secname:{type:String,required:true},
    bookId:[{type:mongoose.Schema.Types.ObjectId,
    ref:"book",
required:true
}]
},
{
    timestamps:true,
    versionKey:false

}
  
);
//Section Model
const Sec= mongoose.model("section",sectionSchema);

//Book Schema

const bookSchema=new mongoose.Schema({
    book:{type:String,required:true},
    body:{type:String,required:true},
   

    sectionsId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"section",
        required:true
    },
},
{
    timestamps:true,
    versionKey:false
}
)

const Book= mongoose.model("book",bookSchema);

//author Schema

const authorSchema=new mongoose.Schema({
    firstName:{type:String,required:true},
    lastName:{type:String,required:true},
  
     bookId:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"book",
      required:true
  }
  },{
  
  timestamps:true,
  versionKey:false
  
  
  });
  
  const Author= mongoose.model("author",authorSchema);


  
const bookAuthor=new mongoose.Schema({
    bookId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"book",
        required:true
    },
    authorId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    }
},{
    timestamps:true,
    versionKey:false
})
const Bookauthor=mongoose.model("bookAuthor",bookAuthor)

//checkoutSchema

const checkoutSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    bookId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"book",
        required:true
    }
},{
timestamps:true,
versionKey:false

})
const Check=mongoose.model("checkout",checkoutSchema)







//section crud
app.get("/sections/:secname",async(req,res)=>{
    try{
    const sections= await Sec.find({secname:req.params.secname}).populate({
        path:"bookId",
        select:{name:1}
    }).lean().exec();
    return res.status(200).send(sections);
    }catch(err){
      return  res.status(500).send(err.message);
    }
});





//book crud

app.post("/books",async(req,res)=>{
    try{
    const book= await Book.create(req.body)
    return res.status(201).send(book)
    }
    catch(err){
        return res.status(500).send({message:err.message})
    }
})




//author crud
app.get("/authors/:firstName",async(req,res)=>{
    try{
    const authors= await Author.find({firstName:req.params.firstName}).populate({
        path:"bookId",
        select:{name:1}
    }).lean().exec();
    return res.status(200).send(authors);
    }catch(err){
      return  res.status(500).send(err.message);
    }
});





app.listen(5000,async()=>{
    
        try {
             await connect();
        } catch (error) {
            console.log(error);
            
        }
        console.log("Listening at Port 5000")
    
});