import nodemailer from "nodemailer";

const transporter=nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS
    }
})

export const sendExpiryNotification=async(
    email:string,
    name:string,
    items:any[]
)=>{
    const itemRows=items.map((i)=>`
        <tr>
            <td style="padding:8px;border:1px solid #e2e8f0">${i.name}</td>
            <td style="padding:8px;border:1px solid #e2e8f0">${i.category||"N/A"}</td>
            <td style="padding:8px;border:1px solid #e2e8f0">${new Date(i.expiryDate).toDateString()}</td>
            <td style="padding:8px;border:1px solid #e2e8f0">${i.quantity||"N/A"}</td>
        </tr>
        `
    ).join("");
    await transporter.sendMail({
        from:process.env.EMAIL_USER,
        to:email,
        subject:"FOOD Expiry Alert - Items Expiring Soon !",
        html:`
            <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
                <div style ="background:#548454;padding:20px;border-radius:8px 8px 0 0 ">
                    <h1 style="color:white;margin:0">AI Food Tech</h1>
                    <p style="color:#e3ebe3;margin:5px 0 0">Food Expiry Alert</p>
                </div>

                <div style="padding:20px;background:white;border:1px solid #e2e8f0">
                    <p>Hi <strong>${name}</strong>,</p>
                    <p>The following items are expiring soon:</p>

                    <table style="width:100%;border-collapse:collapse;margin:16px 0">
                        <thead>
                            <tr style="background:#f4f7f4">
                                <th style="padding:8px;border:1px solid #e2e8f0;text-align:left">Item</th>
                                <th style="padding:8px;border:1px solid #e2e8f0;text-align:left">Category</th>
                                <th style="padding:8px;border:1px solid #e2e8f0;text-align:left">Expiry</th>
                                <th style="padding:8px;border:1px solid #e2e8f0;text-align:left">Quantity</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${itemRows}
                        </tbody>
                    </table>

                    <p style="color:#548454;font-weight:bold">
                        Please use this items before they expire!
                    </p>
                </div>

                <div style="background:#f4f7f4;padding:12px;border-radius:0 0 8px 8px;text-align:center">
                    <p style="color:#74a074;font-size:12px;margin:0">
                        "AI FOOD TECH REDUCING FOOD WASTE TOGETHER"
                    </p>
                </div>
            </div>
        `
    })
}

export const sendAutoWastedNotification=async(
    email:string,
    name:string,
    items:any[]
)=>{
    const itemList=items.map((i)=>`
        <li>${i.name} {expired:${new Date(i.expiryDate).toDateString()}}</li>
    `
    ).join("")

    await transporter.sendMail({
        from:process.env.EMAIL_USER,
        to:email,
        subject:"Items Auto-Marked as Wasted",
        html:`
            <div style="font-family:Arial,sans-serif;max-width:600 px;margin 0 auto">
                <div style="background:#548454;padding:20 px;border-radius:8px 8px 0 0">
                    <h1 style="color:white;margin:0">AI FOOD TECH</h1>
                    <p style="color:#e3ebe3;margin:5px 0 0">Waste Report</p>
                </div>

                <div style="padding:20px;background:white;border:1px solid #e2e8f0">
                    <p>Hi <strong>${name}</strong>,</p>
                    <p>The following items have been automatically marked as <strong style="color:red">WASTED</strong> as they expired over a day ago:</p>
          
                    <ul style="color:#548454">
                        ${itemList}
                    </ul>

                    <p>Tip: Check your inventory regularly to reduce food waste!</p>
                </div>
                <div style="background:#f4f7f4;padding:12px;border-radius:0 0 8px 8px;text-align:center">
                    <p style="color:#74a074;font-size:12px;margin:0">
                        AI Food Tech - Reducing Food Waste Together
                    </p>
                </div>

            </div>
        `
    })
}