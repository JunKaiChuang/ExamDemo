import configparser
import os
import string
from django.conf import settings
import http.client
import json
import requests
from requests.exceptions import RequestException, HTTPError, URLRequired


class Auth0APIHelper:

    def __init__(self):
        # Get project path from settings.py
        base_dir = settings.BASE_DIR

        # static path
        static_files_dirs = os.path.join(base_dir, 'static')

        # set config parser
        config = configparser.ConfigParser()

        # read from static folder
        config.read(static_files_dirs + '/configuration/web_config.ini')

        # set config value
        self.client_id = config['auth0_api_config']['client_id']
        self.client_secret = config['auth0_api_config']['client_secret']
        self.audience = config['auth0_api_config']['audience']
        self.grant_type = config['auth0_api_config']['grant_type']
        self.domain = config['auth0_api_config']['domain']
        self.token = ""
        self.base_url = f"https://{self.domain}"

        self.refreshToken()

    def refreshToken(self):
        """Get Auth0 management access token, and set it to self.token ."""

        payload = {
            'grant_type': self.grant_type,
            'client_id': self.client_id,
            'client_secret': self.client_secret,
            'audience': self.audience
        }

        response = requests.post(f'{self.base_url}/oauth/token', data=payload)
        oauth = response.json()
        self.token = oauth.get('access_token')

    def getUserDetail(self, uid):
        """Get user data from Auth0 API, /users ."""

        headers = {
            'Authorization': f'Bearer {self.token}',
            'Content-Type': 'application/json'
        }

        # Get all Applications using the token
        try:
            res = requests.get(f'{self.base_url}/api/v2/users/{uid}', headers=headers)
            res.raise_for_status()
            return res.json()
        except HTTPError as e:
            print(f'HTTPError: {str(e.response.status_code)} {str(e.response.reason)}')
        except URLRequired as e:
            print(f'URLRequired: {str(e.reason)}')
        except RequestException as e:
            print(f'RequestException: {e}')
        except Exception as e:
            print(f'Generic Exception: {e}')

    def reSendEmail(self, uid):
        """Send an email to the specified user."""

        headers = {
            'Authorization': f'Bearer {self.token}'
        }

        data = {
            "user_id": uid
        }

        # Get all Applications using the token
        try:
            res = requests.post(f'{self.base_url}/api/v2/jobs/verification-email', headers=headers, data=data)
            res.raise_for_status()
            return res.json()
        except HTTPError as e:
            print(f'HTTPError: {str(e.response.status_code)} {str(e.response.reason)}')
        except URLRequired as e:
            print(f'URLRequired: {str(e.reason)}')
        except RequestException as e:
            print(f'RequestException: {e}')
        except Exception as e:
            print(f'Generic Exception: {e}')

    def reSetPassword(self, uid, password):
        """Reset user passowrd"""
        headers = {
            'Authorization': f'Bearer {self.token}'
        }

        data = {
            "password": password
        }

        # Get all Applications using the token
        try:
            res = requests.patch(f'{self.base_url}/api/v2/users/{uid}', headers=headers, data=data)
            res.raise_for_status()
            return 'Password reset success!'
        except HTTPError as e:
            print(f'HTTPError: {str(e.response.status_code)} {str(e.response.reason)}')
        except URLRequired as e:
            print(f'URLRequired: {str(e.reason)}')
        except RequestException as e:
            print(f'RequestException: {e}')
        except Exception as e:
            print(f'Generic Exception: {e}')

    def isOldPasswordCorrect(self, user_name, password):
        """Check old password correct (try oauth)"""

        headers = {
            'Authorization': f'Bearer {self.token}'
        }

        payload = {
            'grant_type': 'password',
            'client_id': self.client_id,
            'client_secret': self.client_secret,
            'username': user_name,
            'password': password
        }

        response = requests.post(f'{self.base_url}/oauth/token', headers=headers, data=payload)

        if response.status_code != 200:
            return False
        else:
            return True
