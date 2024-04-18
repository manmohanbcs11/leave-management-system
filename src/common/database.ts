import mongoose from 'mongoose';


export class Database{
  public async connectToMongo(): Promise<void> {
    try {
      await mongoose.connect(process.env.MONGO_CONNECTION_URL);
      console.log('connected to mongoDB.\n');
    } catch (err) {
      throw new Error('Failed to connect to mongoDB. Error: ' + err.message);
      }
  }
}