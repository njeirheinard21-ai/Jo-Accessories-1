import re

with open('src/features/catalog/components/home/Lookbook.tsx', 'r') as f:
    text = f.read()

text = text.replace('to="/lookbook"', 'to="/shop"')

with open('src/features/catalog/components/home/Lookbook.tsx', 'w') as f:
    f.write(text)
