const mongoose =require('mongoose');
const transactionShema=new mongoose.Schema({
    user:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
    title:{type:String,required:true},
    amount:{type:Number,required:true},
    date:{type:Date,required:true},
    type:{type:String,enum:["income","expense"],required:true}
},{ timestamps: true })

module.exports=mongoose.model('Transaction',transactionShema)