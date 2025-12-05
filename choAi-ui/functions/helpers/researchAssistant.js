import axios from "axios";
import { config } from "dotenv";

// require("dotenv").config();

const resolveRedirect = async (url) => {
  try {
    const response = await axios.get(decodeURIComponent(url), {
      maxRedirects: 5,
      validateStatus: (status) => status >= 200 && status < 400,
      timeout: 2000,
    });

    if (response.status != 200) {
      console.warn(
        `Warning: Received status code ${response.status} for URL: ${url}`
      );
      return url;
    }
    const finalUrl = response.request.res.responseUrl || url;

    console.log("Resolved URL:", finalUrl);
    return finalUrl;
  } catch (error) {
    return url;
  }
};

async function addCitations(response, responseText) {
  let text = responseText;

  const supports = response.candidates[0]?.groundingMetadata?.groundingSupports;
  const chunks = response.candidates[0]?.groundingMetadata?.groundingChunks;

  // Sort supports by end_index in descending order to avoid shifting issues when inserting.
  if (!supports || !chunks) {
    return text;
  }
  console.log("Adding citations to text:", supports, chunks);
  const sortedSupports = [...supports].sort(
    (a, b) => (b.segment?.endIndex ?? 0) - (a.segment?.endIndex ?? 0)
  );

  const resolvedUrlsCache = {};

  for (const support of sortedSupports) {
    const endIndex = support.segment?.endIndex;
    if (endIndex === undefined || !support.groundingChunkIndices?.length) {
      continue;
    }

    const citationPromises = support.groundingChunkIndices.map(async (i) => {
      const uri = chunks[i]?.web?.uri;
      if (uri) {
        if (!resolvedUrlsCache[uri]) {
          resolvedUrlsCache[uri] = await resolveRedirect(uri);
        }
        return `[${i + 1}](${resolvedUrlsCache[uri]})`;
      }
      return null;
    });

    const citationLinks = (await Promise.all(citationPromises)).filter(Boolean);

    if (citationLinks.length > 0) {
      const citationString = citationLinks.join(", ");
      text = text.slice(0, endIndex) + citationString + text.slice(endIndex);
    }
  }

  return text;
}

const plagiarismChecker = async (text) => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.WINSTON_AI_TOKEN}`,
    },
    body: JSON.stringify({
      text: text,
      languages: ["en"],
    }),
  };

  try {
    const response = await fetch(process.env.PLAGIARISM_URL, options);
    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      throw new Error(
        `Plagiarism check failed: ${data.message || "Unknown error"}`
      );
    }
  } catch (error) {
    console.error("Error during plagiarism check:", error);
    throw error;
  }
};

export const researchAssistant = async (
  genAI,
  assistantRef,
  content,
  plagiarismChecked = false,
  history = []
) => {
  let fullText = "";

  console.log("------RESEARCH ASSISTANT PROCESSING REQUEST------");

  if (plagiarismChecked) {
    plagiarismChecked = await plagiarismChecker(content);
    console.log("Plagiarism check results:", plagiarismChecked);
    const plagiarismReportPrompt =
      "You are to provide a detailed plagiarism report based on the following  results: " +
      JSON.stringify(plagiarismChecked) +
      "\n\nBased on the above data, generate a comprehensive plagiarism report highlighting the extent of plagiarism, key sources involved, and suggestions for proper citation and content originality improvement.";

    const chat = genAI.chats.create({
      model: "gemini-2.5-flash-lite",
      config: {
        temperature: 1,
        systemInstructions:
          " You are an academic plagiarism report generator. Your task is to analyze the provided plagiarism check results and generate a detailed report. The report should include the extent of plagiarism detected, key sources involved, and suggestions for proper citation and improving content originality. Ensure clarity, accuracy, and depth in your responses to facilitate effective understanding.",
        maxOutputTokens: 2000,
      },
    });

    const result = await chat.sendMessageStream({
      message: plagiarismReportPrompt,
    });
    for await (const chunk of result) {
      const text = chunk.text;
      if (text) {
        fullText += text;
        await assistantRef.update({ text: fullText });
      }
    }
    await assistantRef.update({ status: "complete" });
    return fullText;
  }

  const sysConfig =
    "You are AskCho research assistant. Provide a detailed and comprehensive academic support to user queries. For every query provide detailed explanations, relevant examples, and cite credible sources. Ensure clarity, accuracy, and depth in your responses to facilitate effective learning and understanding.";

  const chat = genAI.chats.create({
    model: "gemini-2.5-flash-lite",
    history: history,
    config: {
      temperature: 0.2,
      systemInstructions: sysConfig,
      maxOutputTokens: 6000,
      tools: [{ googleSearch: {} }, { urlContext: {} }],
    },
  });

  let plagiarismReportPrompt = "";

  const result = await chat.sendMessageStream({ message: content });

  for await (const chunk of result) {
    const text = chunk.text;
    if (text) {
      fullText += text;
      await assistantRef.update({ text: fullText });
    }
    if (chunk.candidates[0]?.groundingMetadata) {
      const textWithCitations = await addCitations(chunk, fullText);
      await assistantRef.update({ text: textWithCitations });
      console.log(
        "---------------------------------------------------------------------------------"
      );
    }
  }

  await assistantRef.update({ status: "complete" });

  return fullText;
};
