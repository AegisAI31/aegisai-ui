"use client";

const logos = [
  { name: "Anthropic", className: "logo-anthropic" },
  { name: "OpenAI", className: "logo-openai" },
  { name: "Google Cloud", className: "logo-google" },
  { name: "Microsoft", className: "logo-microsoft" },
  { name: "Meta", className: "logo-meta" },
  { name: "Cohere", className: "logo-cohere" },
  { name: "AWS", className: "logo-aws" },
  { name: "NVIDIA", className: "logo-nvidia" },
  { name: "Databricks", className: "logo-databricks" },
  { name: "Snowflake", className: "logo-snowflake" },
];

export function LogoCarousel() {
  return (
    <div className="logo-carousel">
      <div className="logo-track">
        {logos.map((logo, i) => (
          <div key={`a-${i}`} className={`logo-item ${logo.className}`} aria-label={logo.name}>
            <span>{logo.name}</span>
          </div>
        ))}
        {logos.map((logo, i) => (
          <div key={`b-${i}`} className={`logo-item ${logo.className}`} aria-hidden="true">
            <span>{logo.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
