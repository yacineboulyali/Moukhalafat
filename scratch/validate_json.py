import json
import sys

try:
    with open(r'c:\Users\Yacine\Downloads\Mission_R1_Complet.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    print("JSON is valid")
except Exception as e:
    print(f"JSON is invalid: {e}")
