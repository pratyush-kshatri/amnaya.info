import { z } from 'zod';

const emailRule = z.string().min(1, 'Email is required').email('Invalid email address').trim();

const usernameRule = z
  .string()
  .min(3, 'Username must be at least 3 characters')
  .regex(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers and underscores allowed')
  .trim();

const passwordRule = z
  .string()
  .min(8, 'Password must be atleast 8 characters')
  .regex(/[A-Z]/, 'Must contain atleast one uppercase letter')
  .regex(/[a-z]/, 'Must contain atleast one lowercase letter')
  .regex(/[0-9]/, 'Must contain atleast one number')
  .regex(/[^A-Za-z0-9]/, 'Must contain atleast one special character');

const nameRule = z
  .string()
  .min(2, 'Must be atleast 2 characters')
  .regex(/^[a-zA-Z\s]*$/, 'Only letters allowed')
  .trim();

const birthDateRule = z
  .coerce
  .date()
  .max(new Date(), 'Birth date cannot be in the future');

const emailOrUsernameRule = z
  .string()
  .min(1, 'Email or Username is required')
  .trim()
  .refine((val) => emailRule.safeParse(val).success || usernameRule.safeParse(val).success, {
    message: 'Enter a valid email or username'
  });

// Login
const loginSchema = z.object({
  emailOrUsername: emailOrUsernameRule,
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional()
});

const forgotPasswordSchema = z.object({
  emailOrUsername: emailOrUsernameRule,
});

const signupSchema = z.object({
  firstName: nameRule,
  lastName: nameRule,
  birthDate: birthDateRule,
  gender: z.enum(['male', 'female', 'other'], {
    message: 'Please select a gender'
  }),
  username: usernameRule,
  email: emailRule,
  password: passwordRule,
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
});

export { loginSchema, forgotPasswordSchema, signupSchema };

export type LoginValues = z.infer<typeof loginSchema>;
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;
export type SignupValues = z.infer<typeof signupSchema>;
