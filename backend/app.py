from flask import Flask, request, jsonify
from flask_cors import CORS
import anthropic
import re
import json

app = Flask(__name__)
CORS(app)


client = anthropic.Anthropic(
    # use from .env variable "CLAUDE_API_KEY"
    api_key="CLAUDE_API_KEY"
)

    def extract_json(text):
        start_index = text.find('{')
        end_index = text.rfind('}')
        if start_index!= -1 and end_index!= -1:
            json_string = text[start_index:end_index+1]
            json_string = json_string.replace('\\n', '\n').replace('\\"', '"')
            try:
                json_data = json.loads(json_string)
                return json_data
            except json.JSONDecodeError as e:
                print(f"Failed to parse JSON: {e}")
                return None
        else:
            print("No JSON found in the text.")
        return None

def get_difficulty(difficulty):
    if difficulty == "1":
        return "easy"
    elif difficulty == "2":
        return "medium"
    elif difficulty == "3":
        return "hard"
    else:
        return "medium"

@app.route('/api/trivia', methods=['GET'])
def get_trivia():
    team_name = request.args.get('teamName')
    difficulty = get_difficulty(request.args.get('difficulty'))

    if not team_name:
        return jsonify({"error": "Missing teamName parameter"}), 400

    prompt = "Generate a trivia question about the NBA team {team_name} with a difficulty level of {difficulty}. The question should be about the team or one of its members. For easy difficulty, the question should be straightforward, such as \"Between 2001-2021, how many games did the Warriors win?\" For medium difficulty, the question should be more challenging but not too vague. For difficult difficulty, the question should be more complex and specific, such as \"What is the most number of points X player has scored in a game before 2021?\" Provide a hint, four options (including the correct answer), and the correct answer in the JSON format with keys \'hint\', \'option1\', \'option2\', \'option3\', \'option4\', and \'correctanswer\'. Ensure all responses are in JSON format exclusively. Here is an example of the JSON output: { \"hint\": \"Hint about the question\", \"option1\": \"Option 1\", \"option2\": \"Option 2\", \"option3\": \"Option 3\", \"option4\": \"Option 4\", \"correctanswer\": \"Correct answer\" } Use the following structure for your response: { \"hint\": \"{hint}\", \"option1\": \"{option1}\", \"option2\": \"{option2}\", \"option3\": \"{option3}\", \"option4\": \"{option4}\", \"correctanswer\": \"{correctanswer}\" }"
    prompt = prompt.replace("{team_name}", team_name)
    prompt = prompt.replace("{difficulty}", difficulty)

    message = client.messages.create(
        model="claude-3-sonnet-20240229",
        max_tokens=1000,
        temperature=0.9,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": prompt
                    }
                ]
            }
        ]
    )

    # Extract the text content from the message.content
    response_text = str(message.content)
    print("log: ")
    print(response_text)

    # Parse the JSON data from the response text
    response_json = extract_json(response_text)
    return jsonify(response_json)

@app.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
    return response

if __name__ == '__main__':
    app.run(port=6968)