import z from "zod"

export const registerUserSchema = z.object({
    body: z.object({
        name: z.string().min(5, 'Fullname must be at least 5 characters'),
        email: z.string().email('Invalid email address'),
        password: z.string().min(6, 'Password must be at least 6 characters')
    })
})

export const loginUserSchema = z.object({
    body: z.object({
        email: z.string().email('Invalid email address'),
        password: z.string().min(1, 'Password is required')
    })
})

export const changePasswordSchema = z.object({
    body: z.object({ 
        oldPassword: z.string().min(1, "Current password is required"), 
        newPassword: z.string().min(8, "Password must be at least 8 characters"),
        confirmPassword: z.string().min(1, "Please confirm your new password"),
    })
})