"use client";

import { createElement, useEffect } from "react";
import { defineZyloFloatingWidget } from "@zylosystems/zylo-floating-widget";

export default function ZyloFloatingStatusWidget() {
  useEffect(() => {
    defineZyloFloatingWidget();
  }, []);

  return createElement("zylo-floating-widget", {
    status: "green",
    "api-key": process.env.NEXT_PUBLIC_ZYLO_DOCS_API_KEY,
  });
}
