#!/usr/bin/env python3
import re

filePath = r'c:\Users\kabil\OneDrive\Desktop\Traffix_Traffic_Controller\frontend\src\app\TnTrafficPortal.jsx'

with open(filePath, 'r', encoding='utf-8') as f:
    content = f.read()

# Remove all <Icon name="..." /> patterns
pattern = r'<Icon\s+name="[^"]*"\s*/?>'
content = re.sub(pattern, '', content)

# Clean up extra whitespace
content = re.sub(r'>\s+</', '></', content)

with open(filePath, 'w', encoding='utf-8') as f:
    f.write(content)

print('All Icon components removed')
