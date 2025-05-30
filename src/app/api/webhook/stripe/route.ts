import { db } from "@/server/db";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: "2025-02-24.acacia",

});
export async function POST(req:Request){
    const body = await req.text();
    const signature = req.headers.get("Stripe-Signature") as string;
    let event: Stripe.Event;


    try {
        event = stripe.webhooks.constructEvent(
            body, 
            signature, 
            process.env.STRIPE_WEBHOOK_SECRET as string);

        const session = event.data.object as Stripe.Checkout.Session;

        if(event.type === "checkout.session.completed" || event.type === "invoice.payment_succeeded"){
            const payment =  await stripe.checkout.sessions.retrieve(session.id);
            const credits = session.metadata?.['credits']
            const userId = session.client_reference_id;
    
            if (!userId || !credits)
                    return NextResponse.json({error: 'Invalid Session'}, {status: 400});
            await db.stripeTransaction.create({data:{userId, credits: parseInt(credits)}});
            await db.user.update({where:{id: userId}, data:{credits: {increment: parseInt(credits)}}});
    
    
            // return NextResponse.json({msgg: 'Credits added successfully'}, {status: 200});
        }
            return NextResponse.json(null, {status: 200});
    } catch (error) {
        console.log('error', error);
        return NextResponse.json({error: 'Invalid Signature'}, {status: 400});
    }

   
}

