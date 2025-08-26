// import { NextResponse } from "next/server";
// import jwt from "jsonwebtoken";

// const SECRET_KEY = "mysecretkey"; // Store in .env in real apps

// export async function GET(req: Request) {
//   const authHeader = req.headers.get("authorization");

//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//   }

//   const token = authHeader.split(" ")[1];

//   try {
//     const decoded = jwt.verify(token, SECRET_KEY) as { role: string };
//     if (decoded.role !== "admin") {
//       return NextResponse.json({ message: "Forbidden: Insufficient Permissions" }, { status: 403 });
//     }
//     return NextResponse.json({ message: "Welcome Admin! You have access." }, { status: 200 });
//   } catch (error) {
//     return NextResponse.json({ message:error instanceof Error ? error.message : "Invalid or Expired Token" }, { status: 401 });
//   }
// }


import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const SECRET_KEY = "mysecretkey";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as { role: string };
    if (decoded.role !== "admin") {
      return NextResponse.json({ message: "Forbidden: Insufficient Permissions" }, { status: 403 });
    }
    return NextResponse.json({ message: "Welcome Admin! You have access." });
  } catch (error) {
    return NextResponse.json({ message:error instanceof Error ? error.message :  "Invalid or Expired Token" }, { status: 401 });
  }
}
