import { ConvexHttpClient } from "convex/browser";
import { makeFunctionReference } from "convex/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!convexUrl) {
    return Response.json(
      { error: "Convex not configured (NEXT_PUBLIC_CONVEX_URL)" },
      { status: 503 }
    );
  }
  try {
    const client = new ConvexHttpClient(convexUrl);
    const getRef = makeFunctionReference<"query">("evaluations:getEvaluation");
    const evaluation = await client.query(getRef, { id });
    if (!evaluation) {
      return Response.json({ error: "Evaluation not found" }, { status: 404 });
    }
    return Response.json(evaluation);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}
