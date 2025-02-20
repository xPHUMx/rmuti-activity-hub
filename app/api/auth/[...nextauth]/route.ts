
// import NextAuth, { AuthOptions, DefaultSession } from "next-auth";
// import GoogleProvider from "next-auth/providers/google";
// import User from "../../../../models/User";
// import connectToDatabase from "../../../../utils/db";

// // เพิ่มประเภทสำหรับ user ใน session
// declare module "next-auth" {
//   interface Session {
//     user: {
//       role: string;
//       id: string | null;
//       hasProfile: boolean;
//     } & DefaultSession["user"];
//   }

//   interface User {
//     role: string;
//     id: string | null;
//     hasProfile: boolean;
//   }
// }

// const authOptions: AuthOptions = {
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_ID!,
//       clientSecret: process.env.GOOGLE_SECRET!,
//     }),
//   ],
//   callbacks: {
//     async session({ session, token }) {
//       if (token) {
//         session.user = {
//           ...session.user,
//           role: token.role as string,
//           id: token.id as string,
//           hasProfile: token.hasProfile as boolean,
//         };
//       }
//       return session;
//     },
//     async jwt({ token, user, account }) {
//       if (user) {
//         token.role = user.role || "user";
//         token.id = user.id || null;
//       }

//       if (account?.provider === "google") {
//         try {
//           await connectToDatabase();
//           const existingUser = await User.findOne({ email: user.email });

//           if (!existingUser) {
//             const newUser = new User({
//               name: user.name,
//               email: user.email,
//               image: user.image,
//               role: "user",
//               studentId: null,
//               department: null,
//               year: null,
//               phone: null,
//             });
//             await newUser.save();
//             token.hasProfile = false;
//           } else {
//             token.role = existingUser.role;
//             token.id = existingUser._id.toString();
//             token.hasProfile = !!(existingUser.studentId && existingUser.department && existingUser.year && existingUser.phone);
//           }
//         } catch (error) {
//           console.error("Error in Google Login:", error);
//         }
//       }

//       return token;
//     },
//   },
//   pages: {
//     signIn: "/login",
//   },
//   secret: process.env.NEXTAUTH_SECRET!,
// };

// const handler = NextAuth(authOptions);
// export { handler as GET, handler as POST };

import NextAuth, { AuthOptions, DefaultSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import User from "../../../../models/User";
import connectToDatabase from "../../../../utils/db";

// เพิ่มประเภทสำหรับ user ใน session
declare module "next-auth" {
  interface Session {
    user: {
      role: string;
      id: string | null;
      hasProfile: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    role: string;
    id: string | null;
    hasProfile: boolean;
  }
}

const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          role: token.role as string,
          id: token.id as string,
          hasProfile: token.hasProfile as boolean,
        };
      }
      return session;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.role = user.role || "user"; // ตั้ง role เป็น user ถ้าไม่มีข้อมูล
        token.id = user.id || null; // ตั้ง id เป็น null ถ้าไม่มี
      }
    
      if (account?.provider === "google") {
        try {
          await connectToDatabase();
          const existingUser = await User.findOne({ email: user.email });
    
          if (!existingUser) {
            const newUser = new User({
              name: user.name,
              email: user.email,
              image: user.image,
              role: "user",
              studentId: null,
              department: null,
              year: null,
              phone: null,
            });
            await newUser.save();
            token.hasProfile = false; // กำหนดว่า user ยังไม่ตั้งค่าโปรไฟล์
          } else {
            token.role = existingUser.role;
            token.id = existingUser._id.toString();
            token.hasProfile = !!(existingUser.studentId && existingUser.department && existingUser.year && existingUser.phone);
          }
        } catch (error) {
          console.error("Error in Google Login:", error);
          token.hasProfile = false; // กำหนดว่าไม่มี profile ถ้ามีข้อผิดพลาดในการดึงข้อมูล
        }
      }
    
      return token;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET!,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
