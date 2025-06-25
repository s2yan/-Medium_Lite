import mongoose from 'mongoose';
const db_Name = "MediumLite"

const connectDb = async () => {
    try{

        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${db_Name}`)
        console.log("Connected to the database: ", connectionInstance.connection.host);
        return connectionInstance;

    }catch(err){
        console.log("Something went  wrong while connecting to the database: ", err);
        process.exit(1);
    }
}

export { connectDb };