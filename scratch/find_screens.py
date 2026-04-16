import json

with open(r'C:\Users\Yacine\.gemini\antigravity\brain\0f9ba1f7-30ef-46d2-b3b2-3499f9e4a847\.system_generated\steps\869\output.txt', 'r', encoding='utf-8') as f:
    data = json.load(f)

projects = data.get('projects', [])
for p in projects:
    screens = p.get('screenInstances', [])
    for s in screens:
        label = s.get('label', '')
        if label:
            print(f"ID: {s['id']}, Label: {label}")
