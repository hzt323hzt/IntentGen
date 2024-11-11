import requests

def prepare(url:str) -> str:
    prompt = "I just wonder know the content of some websites. Please parse the content of this site: '"+ url + \
        "', then pick 3 to 5 production, service or topic categories, YOU MUST GENERATE THE OUTPUT AS THIS FORMAT: [product1, product2...]"
    return prompt

def checkUrl(url:str) -> bool:
    try:
        response = requests.get(url)
        if response.status_code == 200:
            return True
        else:
            return False
    except requests.exceptions.RequestException as e:
        return False



