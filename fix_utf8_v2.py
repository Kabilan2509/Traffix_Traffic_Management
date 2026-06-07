#!/usr/bin/env python3
import os

filepath = "frontend/src/app/TnTrafficPortal.jsx"

# Read file with UTF-8 encoding
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Original replacements - actual corrupted characters
original_replacements = [
    ('â€"', '–'),   # Corrupted em dash  â€" -> –
]

for old, new in original_replacements:
    print(f"Replacing: {repr(old)} -> {repr(new)}")
    count = content.count(old)
    if count > 0:
        print(f"Found {count} occurrences")
        content = content.replace(old, new)
    else:
        print(f"Not found in file")

# Write back with UTF-8 encoding
with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print('UTF-8 character fixes complete')
