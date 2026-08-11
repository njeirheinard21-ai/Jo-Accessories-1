import re

with open('src/components/layout/Header.tsx', 'r') as f:
    text = f.read()

text = text.replace('to="/designers"', 'to="/shop"')

with open('src/components/layout/Header.tsx', 'w') as f:
    f.write(text)
