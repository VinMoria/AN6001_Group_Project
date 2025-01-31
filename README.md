# Introduction
A web-based AI toolbox that supports ChatGPT-4o, ChatGPT-4o Mini, DALL·E 2, and DALL·E 3 through API calls.

# Deploy and Run

## Local
```shell
pip install -r requiremets.txt
python app.py
```
Then visit **127.0.0.1:5000/** with browser

## Server (Docker)
```shell
docker pull redcomet720/myaitoolbox:latest
docker run -d -p 5000:8000 redcomet720/myaitoolbox:latest
```

Then visit **[Your Server IP]:5000/** with browser