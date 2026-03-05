export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { to_email, to_name, subject, message } = req.body;

  if (!to_email || !subject || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const RESEND_KEY = process.env.RESEND_KEY || "re_3U7HF8hq_Kr7K2n26JYhL3dPwjvi9gCsU";
  const RESEND_FROM = "ProfitPenny Studio OS <no-reply@profitpenny.in>";

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: RESEND_FROM,
        to: [to_email],
        subject,
        html: `<div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px;background:#f9f9f7;border-radius:12px;">
          <div style="background:#0A0A0A;padding:16px 24px;border-radius:8px;margin-bottom:24px;display:inline-block;">
            <span style="color:#B5D334;font-weight:800;font-size:16px;letter-spacing:-0.02em;">ProfitPenny</span>
            <span style="color:#888;font-size:12px;margin-left:8px;">Studio OS</span>
          </div>
          <p style="color:#444;font-size:14px;line-height:1.8;">${message.replace(/\n/g, "<br/>")}</p>
          <p style="color:#aaa;font-size:12px;margin-top:32px;border-top:1px solid #e0e0e0;padding-top:12px;">This is an automated notification from ProfitPenny Studio OS. Do not reply to this email.</p>
        </div>`
      })
    });

    const data = await response.json();
    if (!response.ok) {
      console.error("Resend error:", data);
      return res.status(response.status).json({ error: data });
    }
    return res.status(200).json({ ok: true, id: data.id });
  } catch (e) {
    console.error("Email send error:", e);
    return res.status(500).json({ error: e.message });
  }
}
