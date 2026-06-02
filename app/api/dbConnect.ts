import mongoose from "mongoose"
type DBConnectionContext={
    isConnected?:boolean
}

const DBConnection:DBConnectionContext=()=>{
       if(mongoose.connection.readyState===1){
        return {isConnected:true}
       }
       return {isConnected:false}
    }