import { NextResponse } from "next/server";
import AWS from "aws-sdk";

// Configure AWS SDK
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

export async function POST(request) {
  try {
    const applicationData = await request.json();

    console.log("Received application data:", applicationData);

    if (
      !applicationData.name ||
      !applicationData.email ||
      !applicationData.primaryPhone
    ) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Generate unique file name for S3
    const fileName = `application-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 9)}.json`;

    // S3 upload parameters
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: `pending-applications/${fileName}`,
      Body: JSON.stringify({
        ...applicationData,
        submittedAt: new Date().toISOString(),
      }),
      ContentType: "application/json",
    };

    // Upload to S3
    const s3Response = await s3.upload(params).promise();

    console.log("Successfully uploaded to S3:", s3Response.Location);

    return NextResponse.json({
      success: true,
      message: "Application submitted successfully",
      applicationId: fileName,
    });
  } catch (error) {
    console.error("Error submitting application:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error:
          process.env.NEXT_PUBLIC_APP_ENV === "development"
            ? error.message
            : undefined,
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
}
