import { z } from 'zod'

const consent = (message: string) =>
  z.literal(true, { error: message })

export const step8Schema = z.object({
  accuracy: consent('Please confirm the information is accurate.'),
  creditCheck: consent('Please authorise LendSwift to check your credit score.'),
  terms: consent('Please agree to the Terms and Conditions.'),
  communications: consent('Please consent to receive communications regarding this application.'),
})
