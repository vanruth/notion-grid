import fetch from "node-fetch";

export async function handler() {
  const databaseId = "2a712bc9f51280ff8d61f0c569a3c0df"; // Replace with your Notion database ID
  const notionToken = process.env.NOTION_TOKEN;

  const res = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${notionToken}`,
      "Notion-Version": "2022-06-28",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({})
  });

  const data = await res.json();

  const results = data.results.map(page => {
    const props = page.properties;
    return {
      name: props.Name?.title?.[0]?.plain_text || "Untitled",
      publishDate: props['Publish Date']?.date?.start || "",
      status: props.Status?.status?.name || "",
      attachment:
        props.Attachment?.files?.[0]?.file?.url ||
        props.Attachment?.files?.[0]?.external?.url ||
        ""
    };
  });

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    },
    body: JSON.stringify(results)
  };
}
