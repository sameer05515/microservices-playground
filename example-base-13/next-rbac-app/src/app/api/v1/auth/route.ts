// import { NextResponse } from "next/server";
// import jwt from "jsonwebtoken";
// import { users } from "@/data/users";

// const SECRET_KEY = "mysecretkey"; // Store in .env in real apps

// export async function POST(req: Request) {
//   try {
//     const { email, password } = await req.json();
//     const user = users.find((u) => u.email === email && u.password === password);

//     if (!user) {
//       return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
//     }

//     // Generate JWT token with role
//     const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, SECRET_KEY, {
//       expiresIn: "1h",
//     });

//     return NextResponse.json({ token }, { status: 200 });
//   } catch (error) {
//     return NextResponse.json(
//       { message: error instanceof Error ? error.message : "Something went wrong" },
//       { status: 500 }
//     );
//   }
// }

import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { users } from "@/data/users";

const SECRET_KEY = "mysecretkey"; // Store this securely in .env

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) {
    return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
  }

  // Generate JWT token with role
  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, SECRET_KEY, { expiresIn: "1h" });

  return NextResponse.json({ token });
}
