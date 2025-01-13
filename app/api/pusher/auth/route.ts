import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { pusher } from "@/lib/pusher";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    console.log('🔐 Pusher Auth Request Received');
    
    const { userId } = await auth();
    console.log('👤 Auth User ID:', userId);
    
    if (!userId) {
      console.log('❌ No userId found');
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get user data from database
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        imageUrl: true
      }
    });

    console.log('📊 Found user data:', user);

    if (!user) {
      console.log('❌ User not found in database');
      return new NextResponse("User not found", { status: 404 });
    }

    const data = await req.text();
    console.log('📦 Raw Auth Data:', data);

    // Parse the form-urlencoded data properly
    const formData = new URLSearchParams(data);
    const socketId = formData.get('socket_id');
    const channelName = formData.get('channel_name');
    
    console.log('🔌 Socket ID:', socketId);
    console.log('📢 Channel Name:', channelName);

    if (!socketId || !channelName) {
      console.log('❌ Missing socketId or channelName');
      return new NextResponse("Socket ID and channel name required", { 
        status: 400 
      });
    }

    // Generate auth signature for presence channel with user data
    const presenceData = {
      user_id: user.id,
      user_info: {
        id: user.id,
        username: user.username,
        email: user.email,
        imageUrl: user.imageUrl
      }
    };

    console.log('🔑 Generating auth with presence data:', presenceData);
    const authResponse = pusher.authorizeChannel(socketId, channelName, presenceData);

    console.log('✅ Auth Response Generated:', authResponse);
    return NextResponse.json(authResponse);
  } catch (error) {
    console.error("❌ [PUSHER_AUTH] Error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 