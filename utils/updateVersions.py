import json
import http.client

f = open("../data/libraries.json", "r")
libs = json.loads(f.read())
f.close()
output = {}

for name, lib in libs.items():
    if not lib.get("owner") or not lib.get("repo"):
        print("No owner or repo in", name)
        continue

    github = http.client.HTTPSConnection("api.github.com")
    github.request("GET", "/repos" + "/" + lib.get("owner") + "/" + lib.get("repo") + "/tags", "", { "User-Agent": "glub" })
    tags = github.getresponse()

    if tags.status != 200:
        print("Error while retrieving tags of", name + ":", tags.status, tags.reason)
        github.close()
        continue

    versions = json.loads(tags.read().decode())
    github.close()
    outVersions = []

    for version in versions:
        outVersions.append({ "name": version["name"], "sha": version["commit"]["sha"] })

    output[name] = outVersions

f = open("../data/libVersions.json", "w")
f.write(json.dumps(output, sort_keys=True, indent=2, separators=(',', ': ')))
f.close()
