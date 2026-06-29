import { absoluteUrl } from "@/lib/utils";

export function JsonLd() {
  const graph = [
    {
      "@type": "WebSite",
      "@id": absoluteUrl("/#website"),
      "url": absoluteUrl("/"),
      "name": "DineCue",
      "description": "DineCue helps you decide where to eat by matching restaurants to your mood, location, preferences, and dining context."
    },
    {
      "@type": "SoftwareApplication",
      "@id": absoluteUrl("/#software"),
      "name": "DineCue",
      "applicationCategory": "LifestyleApplication",
      "operatingSystem": "Web",
      "description": "A smart dining assistant for mood-aware restaurant decisions.",
      "url": absoluteUrl("/")
    },
    {
      "@type": "Organization",
      "@id": absoluteUrl("/#organization"),
      "name": "DineCue",
      "url": absoluteUrl("/")
    }
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }) }}
    />
  );
}
