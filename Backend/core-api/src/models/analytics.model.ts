import { Schema, Document, Types, model } from 'mongoose'
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2'

export interface IAnalyticsReport extends Document{
    user: Types.ObjectId
    description:string

    timeline:{
        startDate:Date
        endDate:Date
    }

    metrices:{
        totalCost:number
        costWasted:number
    }

    wastedCategory:[{
        category:string,
        items:[{
            name:string,
            cost:number
        }]
    }]
}


const analyticsReportSchema = new Schema<IAnalyticsReport>({
    user:{
        type:Types.ObjectId,
        ref:'user',
        required:true
    },

    description:String,

    timeline:{
        startDate:{type:Date, required:true},
        endDate:{type:Date, required:true}
    },

    metrices:{
        totalCost:{type:Number, required:true},
        costWasted:{type:Number, required:true}
    },

    wastedCategory:[{
        category:{type:String},
        items:[{
            name:{type:String},
            cost:{type:Number}
        }]
    }]
})

analyticsReportSchema.plugin(mongooseAggregatePaginate)
export const analyticsReport = model<IAnalyticsReport>('analyticsReport',analyticsReportSchema)