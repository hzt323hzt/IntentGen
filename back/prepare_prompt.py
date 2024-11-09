import requests

def prepare(url:str) -> str:
    prompt = "parse the content of this website: '"+ url + \
        "', then pick 3 to 5 production categories, output in the format: [product1, product2...]"
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



