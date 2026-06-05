import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import DBConnection from "@/app/lib/dbConnect";
import { GhostLink } from "@/app/model/GhostLink";

export const DELETE = async (
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const session = await getServerSession(authOptions);
  if (!session?.user?._id) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    await DBConnection();

    const result = await GhostLink.deleteOne({ _id: id, userId: session.user._id });

    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, message: "Link not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
};

export const PATCH = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const session = await getServerSession(authOptions);
  if (!session?.user?._id) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const { status } = await req.json();

    if (status !== "active" && status !== "hidden") {
      return NextResponse.json(
        { success: false, message: "status must be 'active' or 'hidden'" },
        { status: 400 }
      );
    }

    await DBConnection();

    const link = await GhostLink.findOneAndUpdate(
      { _id: id, userId: session.user._id },
      { status },
      { new: true }
    );

    if (!link) {
      return NextResponse.json({ success: false, message: "Link not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, link });
  } catch {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
};
