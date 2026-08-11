import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  type?: string;
  image?: string;
  structuredData?: any;
}

export function SEO({ 
  title = 'Jo Accessories | Luxury Fashion',
  description = 'Redefining modern elegance. Discover our premium collection of luxury bags and accessories.',
  canonical,
  type = 'website',
  image = 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop',
  structuredData
}: SEOProps) {
  const siteUrl = import.meta.env.VITE_APP_URL || 'https://jo-accessories.com';
  
  // Organization Schema
  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Jo Accessories",
    "url": siteUrl,
    "logo": `${siteUrl}/logo.png`,
    "sameAs": [
      "https://instagram.com/joaccessories",
      "https://facebook.com/joaccessories"
    ]
  };

  const finalStructuredData = structuredData || defaultStructuredData;

  const url = canonical ? `${siteUrl}${canonical}` : siteUrl;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:site_name" content="Jo Accessories" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <script type="application/ld+json">
        {JSON.stringify(finalStructuredData)}
      </script>
    </Helmet>
  );
}
