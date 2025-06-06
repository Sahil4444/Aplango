export async function POST(request) {
  try {
    const { mobile, message } = await request.json();

    // Your SMS API credentials
    const SMS_CONFIG = {
      username: "aplango",
      apikey: "15798-BD08A",
      sender: "APLNGO", // Replace with your actual sender ID
      route: "TRANS", // Replace with your actual route name
      templateId: "1707174841347143077", // Replace with your actual DLT template ID
    };

    // Construct the SMS API URL
    const smsUrl = new URL("https://bulk.nationalsms.in/sms-panel/api/http/index.php");
    smsUrl.searchParams.append("username", SMS_CONFIG.username);
    smsUrl.searchParams.append("apikey", SMS_CONFIG.apikey);
    smsUrl.searchParams.append("apirequest", "Text");
    smsUrl.searchParams.append("sender", SMS_CONFIG.sender);
    smsUrl.searchParams.append("mobile", mobile);
    smsUrl.searchParams.append("message", message);
    smsUrl.searchParams.append("route", SMS_CONFIG.route);
    smsUrl.searchParams.append("TemplateID", SMS_CONFIG.templateId);
    smsUrl.searchParams.append("format", "JSON");

    // Make the API call
    const response = await fetch(smsUrl.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.text();

    if (response.ok) {
      return new Response(
        JSON.stringify({
          success: true,
          message: "SMS sent successfully",
          data: result,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    } else {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Failed to send SMS",
          error: result,
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  } catch (error) {
    console.error("SMS API Error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Internal server error",
        error: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
