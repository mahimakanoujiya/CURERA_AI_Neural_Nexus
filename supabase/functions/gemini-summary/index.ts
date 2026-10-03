Deno.serve(async (req: Request) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
  };

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { patientInput } = await req.json();

    if (!patientInput || typeof patientInput !== "string") {
      return new Response(
        JSON.stringify({ error: "patientInput is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const apiKey = Deno.env.get("GEMINI_API_KEY");

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "Gemini API key not configured", fallback: true }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const systemPrompt = `You are CURERA AI, a healthcare communication assistant. Your job is to ORGANIZE patient-provided information for professional review. You are NOT a doctor.

STRICT SAFETY RULES:
- NEVER diagnose any disease or condition.
- NEVER prescribe medication or recommend treatment.
- NEVER claim the patient has a specific medical condition.
- NEVER make autonomous clinical decisions.
- You ONLY organize, summarize, and structure what the patient explicitly says.
- You ONLY extract symptoms that the patient explicitly mentions — never infer.
- If the input suggests potentially urgent/emergency language, set emergencyFlag to true and provide a safe routing message. Do NOT diagnose.

Your task: Analyze the patient's description and return a structured JSON object with these exact fields:

{
  "mainConcern": "A concise summary of the primary concern the patient is reporting. Use 'Patient reports: ...' format.",
  "duration": "How long the concern has been present, as stated by the patient. If not mentioned, say 'Not specified by patient'.",
  "symptomsMentioned": ["Array of symptoms EXPLICITLY mentioned by the patient. Only include what they directly state."],
  "relevantInformation": "Important context the patient provided beyond the main concern and symptoms. If none, state that.",
  "additionalQuestions": [
    {
      "question": "A clarification question relevant to the patient's specific symptoms that a healthcare professional may want answered. Make it specific to what the patient reported.",
      "answerType": "One of: 'yes_no', 'scale', or 'text'. Use 'scale' for severity questions, 'yes_no' for yes/no questions, 'text' for descriptive questions."
    }
  ],
  "emergencyFlag": false
}

Rules for additionalQuestions:
- Generate 2 to 5 questions, relevant to the patient's actual symptoms and concerns.
- Do NOT use the same generic questions for every patient.
- Make questions specific to what the patient described.
- Each question must have an appropriate answerType.
- Questions are for information gathering only, never diagnostic.

Return ONLY the JSON object, no markdown, no explanation.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: systemPrompt }],
          },
          contents: [
            {
              role: "user",
              parts: [{ text: patientInput }],
            },
          ],
          generationConfig: {
            temperature: 0.3,
            responseMimeType: "application/json",
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "AI service unavailable", fallback: true }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      return new Response(
        JSON.stringify({ error: "Empty AI response", fallback: true }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(text);
    } catch {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        return new Response(
          JSON.stringify({ error: "Invalid AI response format", fallback: true }),
          { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      parsed = JSON.parse(jsonMatch[0]);
    }

    return new Response(
      JSON.stringify(parsed),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Edge function error:", err);
    return new Response(
      JSON.stringify({ error: "Internal error", fallback: true }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
