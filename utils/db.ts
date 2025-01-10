// import mongoose from "mongoose";

// const MONGODB_URI = process.env.MONGODB_URI as string;

// if (!MONGODB_URI) {
//   throw new Error("Please define the MONGODB_URI environment variable");
// }

// let cached = global.mongoose;

// if (!cached) {
//   cached = global.mongoose = { conn: null, promise: null };
// }

// async function connectToDatabase() {
//   if (cached.conn) {
//     return cached.conn;
//   }

//   if (!cached.promise) {
//     cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => {
//       return mongoose;
//     });
//   }
//   cached.conn = await cached.promise;
//   return cached.conn;
// }

// export default connectToDatabase;


// import mongoose from "mongoose";

// let isConnected = false;

// export default async function connectToDatabase() {
//   if (isConnected) return;

//   try {
//     const db = await mongoose.connect(process.env.MONGODB_URI!, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     isConnected = db.connection.readyState === 1;
//     console.log("Connected to database");
//   } catch (error) {
//     console.error("Failed to connect to database:", error);
//     throw new Error("Failed to connect to database");
//   }
// }


// import mongoose, { Connection } from "mongoose";

// const cached = global.mongoose || { conn: null, promise: null };

// async function connectToDatabase(): Promise<Connection> {
//   if (cached.conn) {
//     return cached.conn;
//   }

//   if (!cached.promise) {
//     cached.promise = mongoose.connect(process.env.MONGODB_URI as string).then((mongooseInstance) => {
//       return mongooseInstance.connection;
//     });
//   }

//   cached.conn = await cached.promise;
//   global.mongoose = cached;

//   return cached.conn;
// }

// export default connectToDatabase;


import mongoose, { Connection } from "mongoose";

declare global {
  var mongoose: {
    conn: Connection | null;
    promise: Promise<Connection> | null;
  };
}

// ตรวจสอบและตั้งค่า global.mongoose
if (!global.mongoose) {
  global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase(): Promise<Connection> {
  // ถ้ามีการเชื่อมต่ออยู่แล้ว ให้คืนค่าการเชื่อมต่อเดิม
  if (global.mongoose.conn) {
    return global.mongoose.conn;
  }

  // ถ้ายังไม่มี Promise การเชื่อมต่อ ให้สร้างใหม่
  if (!global.mongoose.promise) {
    global.mongoose.promise = mongoose
      .connect(process.env.MONGODB_URI as string)
      .then((mongooseInstance) => mongooseInstance.connection);
  }

  // รอการเชื่อมต่อ
  global.mongoose.conn = await global.mongoose.promise;
  return global.mongoose.conn;
}

export default connectToDatabase;


