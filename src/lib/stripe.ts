 "use server"

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
 import Stripe from "stripe";
 const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {  
    apiVersion:'2025-02-24.acacia' 
 });

 export async function createCheckoutSession(credits: number){
    const {userId} = await auth();

    if (!userId) throw new Error('User not found');
  
    const unit_amount = Math.round(credits * 50 * 100);
    console.log('unit_amount', unit_amount);
    const session = await stripe.checkout.sessions.create({
        payment_method_types:['card'],
        line_items:[
            {
                price_data:{
                    currency:'ngn',
                    product_data:{
                        name:`${credits} Co-git Credits`
                    },
                    unit_amount:unit_amount
                },
                quantity: 1
            }
        ],
        customer_creation:"always",
        mode:'payment',
        success_url:`${process.env.NEXT_PUBLIC_APP_URL}/create`,
        cancel_url:`${process.env.NEXT_PUBLIC_APP_URL}/billing`,
        client_reference_id:userId.toString(),
        metadata:{
            credits
        } 
         
    });
    return redirect(session.url as string);
 }