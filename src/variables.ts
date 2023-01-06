
import { QnA } from './types';

export const WEBURL: string = 'https://bugana.eidoriantan.me';
export const WEBAPI: string = 'https://bugana.eidoriantan.me/api';

export const MONTHS: string[] = [
  'JANUARY',
  'FEBRUARY',
  'MARCH',
  'APRIL',
  'MAY',
  'JUNE',
  'JULY',
  'AUGUST',
  'SEPTEMBER',
  'OCTOBER',
  'NOVEMBER',
  'DECEMBER'
];

export const FAQ: QnA[] = [
  {
    section: 'accounts',
    question: 'How do I add/edit my email address?',
    answer: 'You can\'t edit your email address. Contact admin if necessary'
  },
  {
    section: 'accounts',
    question: 'How do I change my account password?',
    answer: 'On My Accounts, just click "Change Password" and input your desired new password.'
  },
  {
    section: 'accounts',
    question: 'How do I verify my account?',
    answer: 'Upon creation of your account, we will require 1 valid ID for verification. The admin will review your application and wait for 1 - 2 hours for the processing.'
  },
  {
    section: 'accounts',
    question: 'Can I link my social media accounts to my Bugana account?',
    answer: 'Unfortunately no. We are working on this feature to be added for the convenience of our customers.'
  },
  {
    section: 'security',
    question: 'Is Bugana allowed to collect my identification documents to verify my account?',
    answer: 'Yes, Bugana will collect your identity documents such as your identification card (IC) details for account and security purposes.'
  },
  {
    section: 'security',
    question: 'How does Bugana ensure my personal data is secure?',
    answer: 'Your personal data is contained behind secured networks and is only accessible by a limited number of employees with special access rights. Should we no longer have any legal or business purpose in retaining your personal data, we will destroy or anonymize it.'
  },
  {
    section: 'security',
    question: 'How many methods of verification should I set up for my Bugana account?',
    answer: 'You should set up ID verification method as possible. This verification methods give us verification to your identity and protect the confidential data in your account as well as our farmers. This makes secure your account.'
  },
  {
    section: 'security',
    question: 'Why have I been locked out of my Bugana account?',
    answer: 'In order to ensure that the Bugana platform is secure, we may suspend Bugana accounts that our system automatically flags as violating our terms and conditions.'
  },
  {
    section: 'security',
    question: 'What should I do if I suspect my account has been hacked or compromised?',
    answer: 'If you suspect that your Bugana account has been compromised, please contact Bugana Hotline for assistance. Change your password immediately if you can access your account.'
  },
  {
    section: 'payments',
    question: 'Can I choose Bank Account as a payment option?',
    answer: 'No, you can’t use your bank account as a payment option. We are looking forward to adding this method for your convenience.'
  },
  {
    section: 'payments',
    question: 'Can I choose E-Wallets/Online Payment as a payment option?',
    answer: 'No, you can’t use your E-Wallets/Online Payment as a payment option. We are looking forward to adding this method for your convenience.'
  },
  {
    section: 'payments',
    question: 'Can I choose a Credit/Debit Card as a payment option?',
    answer: ': No, you can’t use your Credit/Debit Card as a payment option. We are looking forward to adding this method for your convenience.'
  },
  {
    section: 'payments',
    question: 'What are the modes of payment?',
    answer: 'Cash on Pickup and Cash on Delivery are supported modes of payment.'
  },
  {
    section: 'violation',
    question: 'I didn’t claim/pay my first order, what will happen to my account?',
    answer: 'Please be reminded that upon checkout, all orders are considered final. To protect our farmers, we imposed penalties in uncompleted transaction. First offense you will be given a warning and last offense, your account will be permanently banned in using the application.'
  },
  {
    section: 'violation',
    question: 'My account is blocked, why?',
    answer: 'Note that uncompleted transactions will result in a permanent ban on the application.'
  },
  {
    section: 'violation',
    question: 'How to unblock my account?',
    answer: 'Unfortunately you can’t unblock your account as it is considered as permanently banned in using the application to protect our farmers.'
  },
  {
    section: 'delivery',
    question: 'What is Cash on Pickup?',
    answer: 'Payments are made when the products are collected in the designated pickup location.'
  },
  {
    section: 'delivery',
    question: 'What is Cash on Delivery?',
    answer: 'Payments are made when the products are delivered to your doorsteps.'
  },
  {
    section: 'delivery',
    question: 'How do I check the delivery fee for my order?',
    answer: 'Upon checkout, the delivery fee is automatically shown on the receipt based on how far your location is.'
  },
  {
    section: 'delivery',
    question: 'How long it will take for me to receive my order?',
    answer: 'Orders are delivered within the day at the scheduled time 12:00 NN and 6:00 PM'
  },
  {
    section: 'delivery',
    question: 'How is the delivery fee calculated if I purchase products from different farmers in one order?',
    answer: 'All products came from the association of farmers and using one warehouse. Delivery fee is calculated depending on customer’s location.'
  },
  {
    section: 'delivery',
    question: 'How do I get receipt for my orders?',
    answer: 'Upon checkout, order receipt is shown at the completion of orders.'
  },
  {
    section: 'sales',
    question: 'Can I return a product?',
    answer: 'No, you can’t return the product. Upon checkout, you are notified that orders can’t be returned and final.'
  },
  {
    section: 'sales',
    question: 'Can I request a refund?',
    answer: 'No, you can’t request a refund. Orders are non-refundable.'
  }
];
