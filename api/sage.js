export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { message, sagePersona } = req.body;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system: `당신은 ${sagePersona}입니다. 사용자의 고민을 듣고 핵심을 꿰뚫는 한 마디 예언을 내립니다. 규칙: 반드시 한국어로 답하세요. 1~3문장, 절대 길게 쓰지 마세요. 예언서처럼 묵직하고 함축적으로. "~하라", "~이니라", "~리니" 같은 고어체 사용 가능. 간결하게.`,
      messages: [{ role: 'user', content: message }]
    })
  });

  const data = await response.json();
  res.status(200).json({ wisdom: data.content[0].text });
}
