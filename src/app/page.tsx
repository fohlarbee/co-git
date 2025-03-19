import { db } from "@/server/db";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { InfoIcon } from "lucide-react";
import { redirect } from "next/navigation";

export default async function Home() {

  const {userId} = await auth();

  if (!userId) return redirect('/sign-in');

  const dbUser = await db.user.findUnique({where:{id: userId}});
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  if( !user.emailAddresses[0]?.emailAddress) return redirect('/sign-in');
  if (!dbUser){
      await db.user.create({
          data:{
              id:userId,
              email:user.emailAddresses[0].emailAddress,
              firstName: user.firstName,
              lastName: user.lastName,
              imageUrl: user.imageUrl

          }
      });
      return redirect('/dashboard');
  }
  if (dbUser) return redirect('/dashboard');





  return <div className="text-gray-700 bg-green-50 px-4 py-2 rounded-md border border-green-200">
    <div className="flex items-center gap-2">
      <InfoIcon className='size-4'/>
      <p>You will be redirected in <strong>5</strong> Seconds</p>
    </div>
    
  </div>;
}
