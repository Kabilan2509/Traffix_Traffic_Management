#!/usr/bin/env python3
import os

filepath = "frontend/src/app/TnTrafficPortal.jsx"

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace all corrupted UTF-8 sequences
replacements = [
    ('â"€', '='),  # Corrupted box-drawing characters
    ('Â·', '·'),    # Corrupted middle dot
    ('Â©', '©'),    # Corrupted copyright
    ('â€"', '–'),   # Corrupted em dash
    ('â–¼', '▼'),   # Corrupted down triangle
    ('â–²', '▲'),   # Corrupted up triangle
]

for old, new in replacements:
    content = content.replace(old, new)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print('All corrupted UTF-8 characters fixed')
