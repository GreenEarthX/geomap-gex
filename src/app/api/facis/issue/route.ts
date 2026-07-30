import { NextResponse } from "next/server";

export async function POST() {
  const id = crypto.randomUUID().slice(0, 8);

  return NextResponse.json({
    transactionId: id,
    steps: ["validate", "participant", "sign", "status", "offer"],
    offerUri: `openid-credential-offer://facis.demo/${id}`,
    persistedCredentialData: false,
  });
}
