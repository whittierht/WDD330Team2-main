export async function handler(event, context) {
  const targetUrl = "http://server-nodejs.cit.byui.edu:3000" + event.path.replace("/.netlify/functions/proxy", "");

  const response = await fetch(targetUrl);
  const data = await response.text();

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    },
    body: data
  };
}
