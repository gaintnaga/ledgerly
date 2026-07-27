"use client";

// @ts-expect-error swagger-ui-react lacks declaration file
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

export default function DocsPage() {
  return <SwaggerUI url="/api/swagger" />;
}
