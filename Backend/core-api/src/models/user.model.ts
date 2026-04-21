import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from "bcrypt";
import jwt, { type SignOptions, type Secret} from "jsonwebtoken";

export interface IFamilyMember {
    name: string;
    ageGroup: 'INFANT' | 'CHILD' | 'TEEN' | 'ADULT' | 'SENIOR';
    gender: 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY';
    dietaryPractices: string[]; // e.g., ['Vegan', 'Halal', 'Keto']
    healthStatus: string[];     // e.g., ['Peanut Allergy', 'Diabetic', 'Lactose Intolerant']
}

export interface IUser extends Document {
    email: string;
    passwordHash: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    familyMembers: IFamilyMember[]; // Embedded Array
    avatar:string;

    refreshToken:string;
}

const familyMemberSchema = new Schema<IFamilyMember>({
    name:{ 
        type: String, 
        required: true
    },
    ageGroup: { 
        type: String, 
        enum: ['INFANT', 'CHILD', 'TEEN', 'ADULT', 'SENIOR'], 
        required: true 
    },
    gender: { 
        type: String, 
        required: true 
    },
    dietaryPractices: [{ type: String }],
    healthStatus: [{ type: String }]

}, { _id: false }); // Disable separate ObjectIds for subdocuments to keep it clean

const userSchema = new Schema<IUser>({
    email: { 
        type: String, 
        required: true, 
        unique: true,  
    },
    passwordHash: { 
        type: String, 
        required: true 
    },
    name: { 
        type: String, 
        required: true 
    },
    
    avatar:{type:String},
    familyMembers: [familyMemberSchema],

    refreshToken:{type:String}

},{timestamps:true});


userSchema.methods.comparePassword = async function (pass: string) {
    return await bcrypt.compare(pass, this.passwordHash);
}

userSchema.pre("save", async function (next) {
    if (!this.isModified("passwordHash")) return;

    this.passwordHash = await bcrypt.hash(this.passwordHash, 10);
});

userSchema.methods.generateAccessToken = function () {
    const payload = {
        _id: this._id,
        fullname: this.fullname,
        isActive: this.isActive,
        role: this.role
    }

    const options: SignOptions = {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY as any
    }

    return jwt.sign(
        payload,
        process.env.ACCESS_TOKEN_SECRET_KEY as Secret,
        options
    )
}

userSchema.methods.generateRefreshToken = function () {
    const payload = {
        _id:this._id,
        fullname: this.fullname,
        phone:this.phone,
        email:this.email,
        role:this.role
    }

    const options:SignOptions = {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY as any
    }

    return jwt.sign(
        payload,
        process.env.REFRESH_TOKEN_SECRET_KEY as Secret,
        options 
    )
}

export const user = mongoose.model<IUser>('user', userSchema);

