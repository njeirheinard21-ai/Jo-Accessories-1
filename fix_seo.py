with open('src/components/SEO.tsx', 'r') as f:
    text = f.read()

text = text.replace(
"""  type = 'website',
  image = 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop'
: SEOProps) {""",
"""  type = 'website',
  image = 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop',
  structuredData
}: SEOProps) {"""
)

with open('src/components/SEO.tsx', 'w') as f:
    f.write(text)
