import google.generativeai as genai

def callApi(text:str) -> str:
    genai.configure(api_key="YOUR_API_KEY")
    model = genai.GenerativeModel("gemini-1.5-flash")
    response = model.generate_content(text)
    return response.text

def prepareApi():
    pass