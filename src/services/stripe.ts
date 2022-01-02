import Strip from 'stripe'

export const stripe = new Strip(
  process.env.STRIPE_API_KEY,
  {
    apiVersion: '2020-08-27',
    appInfo: {
      name: 'Ignews',
      version: '0.1.0'
    }
  }
)
