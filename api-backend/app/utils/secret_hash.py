import hmac
import hashlib
import base64

def get_secret_hash(username, client_id, client_secret):
    message = username + client_id
    dig = hmac.new(
        key=client_secret.encode('utf-8'),
        msg=message.encode('utf-8'),
        digestmod=hashlib.sha256
    ).digest()
    secret_hash = base64.b64encode(dig).decode()
    return secret_hash

username = "adarshpandeyiitism@gmail.com"
client_id = "3cm526f7chp1vf8bkn59srqss5"
client_secret = "sprg5o91e6n0sffj4mip9l79l46n8p10jk2t94hk8u23hoh3icd"

secret_hash = get_secret_hash(username, client_id, client_secret)
print(secret_hash)
