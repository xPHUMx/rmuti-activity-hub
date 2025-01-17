
// import NextAuth, { AuthOptions, DefaultSession } from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import GoogleProvider from "next-auth/providers/google";
// import User from "../../../../models/User";
// import connectToDatabase from "../../../../utils/db";

// // เพิ่มประเภทสำหรับ user ใน session
// declare module "next-auth" {
//   interface Session {
//     user: {
//       role: string;
//       id: string | null;
//     } & DefaultSession["user"];
//   }

//   interface User {
//     role: string;
//     id: string | null;
//   }
// }

// const authOptions: AuthOptions = {
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_ID!,
//       clientSecret: process.env.GOOGLE_SECRET!,
//     }),
//     CredentialsProvider({
//       name: "Admin Login",
//       credentials: {
//         username: { label: "Username", type: "text", placeholder: "admin" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         if (
//           credentials?.username === "admin" &&
//           credentials?.password === "123456"
//         ) {
//           return {
//             id: "1",
//             name: "Admin",
//             email: "admin@test.com",
//             role: "admin",
//           };
//         }
//         return null;
//       },
//     }),
//   ],
//   callbacks: {
//     async session({ session, token }) {
//       // ตรวจสอบ token ก่อนใช้งาน
//       if (token) {
//         session.user = {
//           ...session.user, // ยังคงข้อมูล user อื่น ๆ
//           role: token.role as string || "user",
//           id: token.id as string || null,
//         };
//       }
//       return session;
//     },
//     async jwt({ token, user, account }) {
//       if (user) {
//         token.role = user.role || "user";
//         token.id = user.id || null;
//       }

//       if (account && account.provider === "google") {
//         try {
//           await connectToDatabase();
//           const existingUser = await User.findOne({ email: user.email });
//           if (!existingUser) {
//             const newUser = new User({
//               name: user.name,
//               email: user.email,
//               image: user.image,
//               role: "user",
//             });
//             await newUser.save();
//           } else {
//             token.role = existingUser.role;
//             token.id = existingUser._id.toString();
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
//   secret: process.env.NEXTAUTH_SECRET,
// };

// import NextAuth, { AuthOptions, DefaultSession } from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import GoogleProvider from "next-auth/providers/google";
// import User from "../../../../models/User";
// import connectToDatabase from "../../../../utils/db";

// // เพิ่มประเภทสำหรับ user ใน session
// declare module "next-auth" {
//   interface Session {
//     user: {
//       role: string;
//       id: string | null;
//     } & DefaultSession["user"];
//   }

//   interface User {
//     role: string;
//     id: string | null;
//   }
// }

// const authOptions: AuthOptions = {
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_ID!,
//       clientSecret: process.env.GOOGLE_SECRET!,
//     }),
//     CredentialsProvider({
//       name: "Admin Login",
//       credentials: {
//         username: { label: "Username", type: "text", placeholder: "admin" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         const adminAccounts = [
//           { username: "admin", password: "123456", role: "admin", id: "1" },
//           { username: "admin2", password: "123456", role: "admin", id: "2" },
//           { username: "admin3", password: "123456", role: "admin", id: "3" },
//         ];

//         const user = adminAccounts.find(
//           (admin) =>
//             admin.username === credentials?.username &&
//             admin.password === credentials?.password
//         );

//         if (user) {
//           return {
//             id: user.id,
//             name: user.username,
//             email: `${user.username}@test.com`,
//             role: user.role,
//           };
//         }

//         return null;
//       },
//     }),
//   ],
//   callbacks: {
//     async session({ session, token }) {
//       if (token) {
//         session.user = {
//           ...session.user, // เก็บข้อมูลที่มีอยู่
//           role: token.role as string, // เพิ่ม role
//           id: token.id as string, // เพิ่ม id
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
//             });
//             await newUser.save();
//           } else {
//             token.role = existingUser.role;
//             token.id = existingUser._id.toString();
//           }
//         } catch (error) {
//           console.error("Error in Google Login:", error);
//         }
//       }

//       return token;
//     },
//   },
//   events: {
//     async signIn({ user }) {
//       console.log("User signing in with ID:", user.id); // เพิ่ม log เพื่อตรวจสอบ
//       if (user?.id) {
//         try {
//           await fetch(`${process.env.NEXTAUTH_URL}/api/online-users`, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ userId: user.id }),
//           });
//         } catch (error) {
//           console.error("Error marking user as online:", error);
//         }
//       }
//     },
//     async signOut({ token }) {
//       console.log("User is signing out with token:", token?.id); // ตรวจสอบค่า token.id
//       if (token?.id) {
//         try {
//           await fetch(`${process.env.NEXTAUTH_URL}/api/online-users`, {
//             method: "DELETE",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ userId: token.id }), // ใช้ token.id แทน
//           });
//         } catch (error) {
//           console.error("Error marking user offline:", error);
//         }
//       }
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
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import User from "../../../../models/User";
import connectToDatabase from "../../../../utils/db";

// เพิ่มประเภทสำหรับ user ใน session
declare module "next-auth" {
  interface Session {
    user: {
      role: string;
      id: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    role: string;
    id: string | null;
  }
}

const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
    CredentialsProvider({
      name: "Admin Login",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "admin" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const adminAccounts = [
          { username: "admin", password: "123456", role: "admin", id: "1" },
          { username: "admin2", password: "123456", role: "admin", id: "2" },
          { username: "admin3", password: "123456", role: "admin", id: "3" },
        ];

        const user = adminAccounts.find(
          (admin) =>
            admin.username === credentials?.username &&
            admin.password === credentials?.password
        );

        if (user) {
          return {
            id: user.id,
            name: user.username,
            email: `${user.username}@test.com`,
            role: user.role,
          };
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user, // เก็บข้อมูลที่มีอยู่
          role: token.role as string, // เพิ่ม role
          id: token.id as string, // เพิ่ม id
        };
      }
      console.log("Session User ID:", session.user.id); // Log เพื่อตรวจสอบ
      return session;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.role = user.role || "user";
        token.id = user.id || null;
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
            });
            const savedUser = await newUser.save();
            token.id = savedUser._id.toString(); // ใช้ _id จาก MongoDB และแปลงเป็น String
            token.role = savedUser.role;
          } else {
            token.id = existingUser._id.toString(); // ใช้ _id จาก MongoDB และแปลงเป็น String
            token.role = existingUser.role;
          }
        } catch (error) {
          console.error("Error in Google Login:", error);
        }
      } else if (account?.provider === "credentials") {
        // กรณีใช้ CredentialsProvider
        token.id = user.id; // ใช้ id ที่กำหนดใน CredentialsProvider
        token.role = user.role || "admin";
      }

      return token;
    },
  },
  events: {
    async signIn({ user }) {
      console.log("User signing in with ID:", user.id); // เพิ่ม log เพื่อตรวจสอบ
      if (user?.id) {
        try {
          await fetch(`${process.env.NEXTAUTH_URL}/api/online-users`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: user.id }),
          });
        } catch (error) {
          console.error("Error marking user as online:", error);
        }
      }
    },
    async signOut({ token }) {
      console.log("User is signing out with token:", token?.id); // ตรวจสอบค่า token.id
      if (token?.id) {
        try {
          await fetch(`${process.env.NEXTAUTH_URL}/api/online-users`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: token.id }),
          });
        } catch (error) {
          console.error("Error marking user offline:", error);
        }
      }
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET!,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
