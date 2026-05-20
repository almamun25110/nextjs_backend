import mongoose from "mongoose";

async function connectDB(){
    try {
        await mongoose.connect(process.env.MONGODB_URI!)
        const connection = mongoose.connection;
        connection.on('Connected', () => {
            console.log("Database connected successfully");
        });
        connection.on('Error', (err) => {
            console.log("Database connection error:", err);
            process.exit(1);
        });
    } catch (error) {
        console.log("Error connecting to the database:", error);
    }
}

export default connectDB;