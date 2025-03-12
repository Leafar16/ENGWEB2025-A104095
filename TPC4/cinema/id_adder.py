import json
counter=0
with open('cinema.json',"r") as f:
    cinema=json.load(f)

    #cinema é um array
for filme in cinema["filmes"]:
    filme['id']=counter
    counter+=1

with open('cinema.json',"w") as f:
    json.dump(cinema,f,indent=4,ensure_ascii=False)
    