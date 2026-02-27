// track.js: Gateway မှ Google Sheet သို့ Data ပို့ပေးမည့် API
module.exports = async (req, res) => {
    // ၁။ User ရဲ့ IP Address ကို ဖမ်းယူခြင်း
    // Vercel ရဲ့ Proxy နောက်ကနေ User ရဲ့ တကယ့် IP ကို ရအောင်ယူတာပါ
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    
    // ၂။ Request Body မှ Data များကို ရယူခြင်း
    const body = req.body || {};
    
    // ၃။ Environment Variable မှ Google Sheet URL ကို ခေါ်ယူခြင်း
    // လုံခြုံရေးအတွက် URL ကို Code ထဲမှာ မရေးဘဲ Vercel Dashboard ကနေပဲ ထည့်ထားရပါမယ်
    const SPREADSHEET_URL = process.env.SHEET_URL;

    // အကယ်၍ URL မထည့်ထားမိပါက Error ပြန်ပေးခြင်း
    if (!SPREADSHEET_URL) {
        console.error("Critical Error: SHEET_URL environment variable is not defined!");
        return res.status(500).send('Server Configuration Error: Missing URL');
    }

    try {
        // ၄။ Google Sheet ဆီသို့ Data များ ပို့ဆောင်ခြင်း (POST Request)
        const response = await fetch(SPREADSHEET_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ip: ip,
                ua: body.ua || "Unknown Device",
                res: body.res || "Unknown Res"
            })
        });

        // ၅။ Google Sheet ဘက်က အဆင်ပြေကြောင်း အကြောင်းပြန်မှု စစ်ဆေးခြင်း
        if (!response.ok) {
            throw new Error(`Google Sheet returned status ${response.status}`);
        }

    } catch (e) {
        // Error တက်ပါက Console တွင် မှတ်တမ်းတင်ပြီး Error Code ပြန်ပေးခြင်း
        console.error("Logging Error:", e.message);
        return res.status(500).send('Logging Failed');
    }

    // အားလုံးအဆင်ပြေပါက Success ပြန်ပေးခြင်း
    res.status(200).send('OK');
};