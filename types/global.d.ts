import { Connection } from "mongoose";

// กำหนดประเภทของ `global.mongoose`
declare global {
  // eslint-disable-next-line no-var
  var mongoose: {
    conn: Connection | null;
    promise: Promise<Connection> | null;
  };
}

// ทำให้ TypeScript รู้จักการขยาย global scope
export {};
