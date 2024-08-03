import { Resend } from 'resend';
// export const resend = new Resend(process.env.NEXT_APP_RESEND_API_KEY);
console.log("RESEND_API_KEY",process.env.NEXT_APP_RESEND_API_KEY);
export const resend = new Resend(process.env.NEXT_APP_RESEND_API_KEY);