import { NextResponse } from "next/server"

import { currentRole } from "@/lib/sessionData"

export async function GET() {
  const role = await currentRole()

  if (role === "PRO") {
    return new NextResponse(null, { status: 200 })
  }

  return new NextResponse(null, { status: 403 })
}
