#!/usr/bin/env python3
filePath = r'c:\Users\kabil\OneDrive\Desktop\Traffix_Traffic_Controller\frontend\src\app\TnTrafficPortal.jsx'

with open(filePath, 'r', encoding='utf-8') as f:
    content = f.read()

# Remove remaining Icon components
replacements = [
    ('<Icon name="search" />', '🔍'),
    ('<Icon name="signals" />', '📡'),
]

for old, new in replacements:
    count = content.count(old)
    if count > 0:
        print(f"Replacing {count} instances of: {old}")
        content = content.replace(old, new)

# Fix corrupted placeholder text
if 'Search events' in content:
    content = content.replace('Search events…', 'Search events...')
if 'Search users' in content:
    content = content.replace('Search users…', 'Search users...')

with open(filePath, 'w', encoding='utf-8') as f:
    f.write(content)

print('Icon components removed successfully')
