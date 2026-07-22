"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";

export default function LatihanAITopic() {
  const params = useParams();

  const topic = decodeURIComponent(params.topic as string);

  useEffect(() => {
    localStorage.setItem("ai_topic", topic);

    window.location.href = "/ujian/ai";
  }, []);

  return null;
}