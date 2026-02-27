module.exports = async (req, res) => {
    // ၁။ User ရဲ့ IP ကို ဖမ်းမယ်
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    
    // ၂။ Request Body ထဲက Data တွေကို ယူမယ် (Error မတက်အောင် fallback ထည့်ထားပေးတယ်)
    const body = req.body || {};
    
    // ၃။ Environment Variable ကနေ URL ကို လှမ်းယူမယ်
    const SPREADSHEET_URL = process.env.SHEET_URL;

    // အကယ်၍ URL မထည့်ထားမိရင် Error တက်အောင် စစ်ပေးထားတယ်
    if (!SPREADSHEET_URL) {
        console.error("Error: SHEET_URL environment variable is missing!");
        return res.status(500).send('Server Configuration Error');
    }

    try {
        // ၄။ Google Sheet ဆီ Data ပို့မယ်
        await fetch(SPREADSHEET_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ip: ip,
                ua: body.ua || "Unknown Device",
                res: body.res || "Unknown Res"
            })
        });
    } catch (e) {
        // အမှားတစ်ခုခုဖြစ်ရင် Console မှာ ကြည့်လို့ရအောင်
        console.error("Sheet ကို ပို့လို့မရဘူး:", e);
        return res.status(500).send('Logging Failed');
    }

    // အားလုံးအဆင်ပြေရင် Success ပြန်ပေးမယ်
    res.status(200).send('OK');
};