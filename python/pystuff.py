import json

# Timsort (Python default)
def timsort(data, key):
    return sorted(data, key=lambda x: x[key].lower())

# Linear search
def linear_search(data, query, keys):
    query = query.lower()
    matches = []

    for item in data:
        for key in keys:
            if key in item and item[key].lower().startswith(query): # Cocokkan huruf awal
                matches.append(item)
                break  # Kalau sudah cocok di satu key, lanjut ke item berikutnya

    # Sort alfabetis berdasarkan 'name'
    matches.sort(key=lambda x: x['name'].lower())
    return matches


# Entry point
def process_request(json_input):
    payload = json.loads(json_input)

    data = payload["data"]
    search_term = payload.get("search", "")
    sort_key = payload.get("sort", "name")  # Default sort by 'name'

    if search_term:
        data = linear_search(data, search_term, ["name"])
    else:
        data = timsort(data, sort_key)

    return json.dumps(data)


# Python menerima dari JS
if __name__ == "__main__":
    import sys
    json_input = sys.stdin.read() # Python membaca data dari JS
    result = process_request(json_input) # Proses pencarian/sorting
    print(result) # Python mengirim kembali ke JS


