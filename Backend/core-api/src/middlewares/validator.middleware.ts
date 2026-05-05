import type { NextFunction, Request, Response } from "express";
import z, { ZodError } from "zod";

export const validate = (schema:z.ZodType)=>{
    return async (req:Request, res:Response, next:NextFunction)=>{
        try{
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params
            })

            return next()

        } catch (err) {
    if (err instanceof ZodError) {
        return res.status(400).json({
            success: false,
            error: "Validation Failed",
            details: err.issues.map(e => ({ path: e.path[1], message: e.message })) // Extract the field and message
        });
    }
    next(err);
    }
}
}
    