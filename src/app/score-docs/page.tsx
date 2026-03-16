import { redirect } from "next/navigation";

/**
 * QR/행사용 전용 URL. 접속 시 메인 페이지로 이동하면서 Doc Score 모달을 바로 연다.
 * e.g. https://zylo-docs.dev/score-docs
 */
export default function ScoreDocsEntryPage() {
  redirect("/?openDocScore=1");
}
