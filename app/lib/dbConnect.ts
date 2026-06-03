import mongoose from "mongoose"
type DBConnectionContext={
    isConnected?:boolean
}

const connection:DBConnectionContext = {}

const DBConnection = async(): Promise<void> => {

  if (connection.isConnected) {
   console.log("already connected to database");
   return;
  }

  try{
     const db = await mongoose.connect(process.env.MONGODB_URI || "");
  connection.isConnected = db.connections[0].readyState === 1;
  console.log("connected to database");
  }
  catch(error){
    console.log(error);
    process.exit(1);
  }
 
};

export default DBConnection;