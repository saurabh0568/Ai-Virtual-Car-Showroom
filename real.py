import google.generativeai as ai
API_KEY=''
ai.configure(api_key=API_KEY)
model= ai.GenerativeModel("gemini-1.5-pro")
chat= model.start_chat()
while True:
    message= input('You: ')
    if message.lower()=='bye':
       print('Chatbot: Goodbye!')
       break
    response= chat.send_message(message)
    print('Chatbot:', response.text)
