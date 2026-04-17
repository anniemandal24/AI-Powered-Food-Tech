import fs from "fs"
import cloudinary from "cloudinary"

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
    api_key: process.env.CLOUDINARY_API_KEY as string,
    api_secret: process.env.CLOUDINARY_API_SECRET as string
})

export const uploadOnCloudinary = async (localFilePath:string)=>{
    try{
        if(!localFilePath) return null;

        const response = await cloudinary.v2.uploader.upload(localFilePath,{
            resource_type: 'auto',
        })

        fs.unlinkSync(localFilePath);
        return response;
        
    }catch(err){
        console.log(`Error occured while uploading file in cloudinary`,err)
        fs.unlinkSync(localFilePath);
        return null;
    } 
}

export const deleteFromCloudinary = async function (public_id:string) {
    try{
        if(!public_id) return null;

        const response = await cloudinary.v2.uploader.destroy(public_id,{
            resource_type:'image'
        })

        if(response?.result==="ok") console.log('deleted successfully');
        else console.log('unable to delete');

    }catch(err){
        console.log('error while deleting file',err);
        return null;
    }
}