import re

with open('src/components/layout/Footer.tsx', 'r') as f:
    text = f.read()

text = text.replace('to="/contact"', 'to="/"')
text = text.replace('to="/shipping"', 'to="/"')
text = text.replace('to="/returns"', 'to="/"')
text = text.replace('to="/faq"', 'to="/"')
text = text.replace('to="/about"', 'to="/"')
text = text.replace('to="/sustainability"', 'to="/"')
text = text.replace('to="/boutiques"', 'to="/"')

with open('src/components/layout/Footer.tsx', 'w') as f:
    f.write(text)
