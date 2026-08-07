import { absoluteUrl } from "@/lib/utils";
import type { Dictionary } from "@/lib/i18n";

type Node = Record<string, unknown>;

/**
 * Structured data is emitted per page, not from the root layout, so private app
 * routes and legal pages never carry schema that does not describe them.
 * See docs/SEO_GUIDELINES.md for what is allowed here.
 */
export function JsonLd({ graph }: { graph: Node[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }) }}
    />
  );
}

const websiteId = absoluteUrl("/#website");
const organizationId = absoluteUrl("/#organization");
const applicationId = absoluteUrl("/#software");

function siteNodes(t: Dictionary): Node[] {
  return [
    {
      "@type": "WebSite",
      "@id": websiteId,
      url: absoluteUrl("/"),
      name: "dinecue",
      description: t.landing.seoDescription,
      inLanguage: ["en", "tr", "de"],
      publisher: { "@id": organizationId }
    },
    {
      "@type": "Organization",
      "@id": organizationId,
      name: "dinecue",
      url: absoluteUrl("/"),
      logo: absoluteUrl("/brand/dinecue-logo.png")
    }
  ];
}

function breadcrumb(path: string, name: string): Node {
  return {
    "@type": "BreadcrumbList",
    "@id": absoluteUrl(`${path}#breadcrumb`),
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "dinecue", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name, item: absoluteUrl(path) }
    ]
  };
}

export function landingGraph(t: Dictionary): Node[] {
  return [
    ...siteNodes(t),
    {
      "@type": "WebApplication",
      "@id": applicationId,
      name: "dinecue",
      applicationCategory: "LifestyleApplication",
      operatingSystem: "Web",
      description: t.landing.seoDescription,
      url: absoluteUrl("/"),
      inLanguage: ["en", "tr", "de"],
      publisher: { "@id": organizationId },
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        description: t.landing.plans.free.description
      }
    },
    {
      "@type": "HowTo",
      "@id": absoluteUrl("/#how-it-works"),
      name: t.landing.sections.howTitle,
      description: t.landing.sections.howBody,
      inLanguage: ["en", "tr", "de"],
      step: t.landing.process.map((step, index) => ({
        "@type": "HowToStep",
        position: index + 1,
        name: step.title,
        text: step.text
      }))
    },
    {
      "@type": "FAQPage",
      "@id": absoluteUrl("/#faq"),
      isPartOf: { "@id": websiteId },
      mainEntity: t.landing.faqItems.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a }
      }))
    }
  ];
}

export function aboutGraph(t: Dictionary): Node[] {
  return [
    ...siteNodes(t),
    {
      "@type": "AboutPage",
      "@id": absoluteUrl("/about#about"),
      url: absoluteUrl("/about"),
      name: t.about.title,
      description: t.about.seoDescription,
      isPartOf: { "@id": websiteId },
      about: { "@id": organizationId }
    },
    breadcrumb("/about", t.about.title)
  ];
}

export function legalGraph(t: Dictionary, path: "/terms" | "/privacy", title: string, description: string): Node[] {
  return [
    ...siteNodes(t),
    {
      "@type": "WebPage",
      "@id": absoluteUrl(`${path}#page`),
      url: absoluteUrl(path),
      name: title,
      description,
      isPartOf: { "@id": websiteId }
    },
    breadcrumb(path, title)
  ];
}
