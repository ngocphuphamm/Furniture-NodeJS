// import mongoose 
const mongoose = require('mongoose');
async function connect()
{
    try {
        await mongoose.connect('mongodb://localhost:27017/furniture');
        console.log('Thành công') 
    }
    catch (error) {
        console.log('thất bại ')
    }

}
module.exports={connect};