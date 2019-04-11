var express= require('express');
var app= express();
var cors = require('cors');
app.use(cors());
app.use(express.static(__dirname));
var bodyParser=require('body-parser');
var http= require('http').Server(app);
var io= require('socket.io')(http);
var mongoose=require('mongoose');
var port=process.env.PORT || 8080;
var dburl="mongodb+srv://ropenflash:lincoln17@freecluster-7t0de.mongodb.net/retest";
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
mongoose.Promise=Promise;
var Message= mongoose.model('Message',{
name:String,
message:String

});

app.get("/messages",(req,res)=>{
    Message.find({},(err,messages)=>{
        res.send(messages);

    });

});
app.get("/messages/:user",(req,res)=>{
    var user= req.params.user;
    Message.find({name:user},(err,messages)=>{
        res.send(messages);

    });

});

app.post("/messages",async(req,res)=>{
    var message=new Message(req.body);
      var savedMessage= await message.save();
     var censored= await Message.findOne({message:"badword"});
     if(censored){
     console.log(censored);
    await Message.remove({_id:censored._id})
     }
     else
       io.emit('message',req.body);
           
           res.sendStatus(200);
   
    });

    io.on("connection",(socket)=>{
        console.log("user connected");
        
            });
    
mongoose.connect(dburl,err=>{

console.log("db connected",err);
});
var server=http.listen( process.env.PORT || 8080,()=>{
console.log("sever is listening on port");

});