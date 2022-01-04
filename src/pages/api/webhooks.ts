import { NextApiRequest, NextApiResponse } from 'next'
import { Readable } from 'stream'
import Stripe from 'stripe'
import { stripe } from '../../services/stripe'
import saveSubscription from './_lib/manage-subscription'

async function buffer(reader: Readable) {
  const chunks = []

  for await (const chunk of reader) {
    chunks.push(
      typeof chunk === 'string' ? Buffer.from(chunk) : chunk
    )
  }

  return Buffer.concat(chunks)
}

export const config = {
  api: {
    bodyParser: false
  }
}

const relevantEvents = new Set([
  'checkout.session.completed',
  'customer.subscription.updated',
  'customer.subscription.deleted'
])

export default async function(req: NextApiRequest, resp: NextApiResponse) {
  if (req.method === 'POST') {
    const buff = await buffer(req)
    const secret = req.headers['stripe-signature']
    
    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(buff, secret, process.env.STRIPE_WEBHOOK_SEC)
    } catch (error) {
      console.error(error)
      return resp.status(400).send(`Webhook error: ${error.message}`)
    }

    const { type } = event

    if (relevantEvents.has(type)) {
      try {
        switch (type) {
          case 'customer.subscription.updated':
          case 'customer.subscription.deleted':
            const subscription = event.data.object as Stripe.Subscription

            await saveSubscription(
              subscription.id,
              subscription.customer.toString(),
              event.type === 'customer.subscription.created'
            )
            break;
          case 'checkout.session.completed':
            const checkoutSession = event.data.object as Stripe.Checkout.Session

            await saveSubscription(
              checkoutSession.subscription.toString(),
              checkoutSession.customer.toString(),
              true
            )
            break;
        
          default:
            throw new Error('Unhandled event.')
        }
      } catch (error) {
        return resp.json({ error: 'Webhook handler failed.' })
      }
    }
  
    resp.json({ received: true })
  } else {
    resp.setHeader('Allow', 'POST')
    resp.status(405).end('Method not allowed')
  }
}