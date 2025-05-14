import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const apiKey = process.env.MAILGUN_PRIVATE_API_KEY;
  const domain = process.env.MAILGUN_DOMAIN;

  if (!apiKey || !domain) {
    return res.status(400).json({ message: "Missing Mailgun credentials" });
  }

  const { name, template, description } = req.body;

  if (!name || !template) {
    return res.status(400).json({ message: "Name and template are required" });
  }

  try {
    const response = await fetch(
      `https://api.mailgun.net/v3/${domain}/templates`,
      {
        method: "POST",
        headers: {
          Authorization:
            "Basic " + Buffer.from(`api:${apiKey}`).toString("base64"),
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          name,
          description: description || "Created via email builder",
          template,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        message: "Failed to save template",
        details: data?.message || "Unknown error",
      });
    }

    return res.status(200).json({
      message: "Template saved successfully",
      data,
    });
  } catch (error: any) {
    console.error("Mailgun error details:", {
      message: error.message,
      stack: error.stack,
      response: error.response?.body || error.response,
      status: error.status
    });

    return res.status(500).json({
      message: "Failed to save template",
      details: error.message,
      error: error.response?.body || error.response || error
    });
  }
}
