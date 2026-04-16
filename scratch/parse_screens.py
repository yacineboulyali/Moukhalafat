import json

path = r'C:\Users\Yacine\.gemini\antigravity\brain\0f9ba1f7-30ef-46d2-b3b2-3499f9e4a847\.system_generated\steps\2287\output.txt'
with open(path, 'r', encoding='utf-8') as f:
    data = json.load(f)

for instance in data.get('screenInstances', []):
    label = instance.get('label', '')
    if any(city in label for city in ['Rabat', 'Fès', 'Marrakech', 'Chefchaouen', 'Dakhla', 'Laâyoune', 'Carte', 'Icon']):
        print(f"ID: {instance['id']}, Label: {label}")
