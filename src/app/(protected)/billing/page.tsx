"use client";

import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { createCheckoutSession } from '@/lib/stripe';
import { api } from '@/trpc/react';
import { InfoIcon } from 'lucide-react';
import React from 'react'

const Billing = () => {
  const {data:user} = api.project.getCredit.useQuery();
  const [creditsToBuy, setCreditsToBuy] = React.useState<number[]>([100]);
  const creditsAmount = creditsToBuy[0]!;
  const price = (creditsAmount * 50).toFixed(2);
  return (
    <div>
      <h1 className='text-xl font-semibold'>Billing</h1>
      <div className='h-2'></div>
      <p className='text-sm text-gray-500'>
        You currently have <strong> {user?.credits}</strong> credits.
      </p> 
      <div className="h-2"></div>
      <div className="bg-green-50 px-4 py-2 rounded-md border border-green-200 text-gray-700">
        <div className="flex items-center gap-2">
          <InfoIcon className='size-4'/>
          <p className='text-sm'>Each credit allows you to index 1 file in a repository</p>
        </div>
        <p className='text-sm'> E.g, If your project has 100 files, you will need 100 credits to index it. </p>
      </div>
      <div className="h-4"></div>
      <Slider defaultValue={[100]}  max={1000} min={20} step={10} onValueChange={value => setCreditsToBuy(value)} value={creditsToBuy}/>
        <div className="h-4"></div>
        <Button
          onClick={() => createCheckoutSession(creditsAmount) }
        >
          Buy {creditsAmount} credits for #{price}
        </Button>
    </div>
  )
}
 
export default Billing