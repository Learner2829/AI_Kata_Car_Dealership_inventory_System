from unittest.mock import patch, MagicMock
from django.test import TestCase
from rest_framework.test import APITestCase
from rest_framework import status


class ChatAPITests(APITestCase):
    def setUp(self):
        self.url = "/api/chat/"

    def test_chat_empty_messages_returns_400(self):
        response = self.client.post(self.url, {"messages": []}, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_chat_missing_messages_field_returns_400(self):
        response = self.client.post(self.url, {}, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    @patch("chat.views.requests.post")
    def test_chat_success_returns_reply(self, mock_post):
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.raise_for_status = MagicMock()
        mock_response.json.return_value = {
            "choices": [{"message": {"content": "Hello! I am Rahul."}}]
        }
        mock_post.return_value = mock_response

        response = self.client.post(
            self.url,
            {"messages": [{"role": "user", "content": "Hi"}]},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("reply", response.data)
        self.assertEqual(response.data["reply"], "Hello! I am Rahul.")

    @patch("chat.views.requests.post")
    def test_chat_strips_think_tags(self, mock_post):
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.raise_for_status = MagicMock()
        mock_response.json.return_value = {
            "choices": [
                {
                    "message": {
                        "content": "<think>some reasoning</think>Hello there!"
                    }
                }
            ]
        }
        mock_post.return_value = mock_response

        response = self.client.post(
            self.url,
            {"messages": [{"role": "user", "content": "Hi"}]},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["reply"], "Hello there!")

    @patch("chat.views.requests.post")
    def test_chat_timeout_returns_504(self, mock_post):
        import requests as req
        mock_post.side_effect = req.exceptions.Timeout()

        response = self.client.post(
            self.url,
            {"messages": [{"role": "user", "content": "Hi"}]},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_504_GATEWAY_TIMEOUT)

    @patch("chat.views.requests.post")
    def test_chat_api_error_returns_502(self, mock_post):
        import requests as req
        mock_post.side_effect = req.exceptions.ConnectionError("refused")

        response = self.client.post(
            self.url,
            {"messages": [{"role": "user", "content": "Hi"}]},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_502_BAD_GATEWAY)

    @patch("chat.views.requests.post")
    def test_chat_invalid_response_format_returns_502(self, mock_post):
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.raise_for_status = MagicMock()
        mock_response.json.return_value = {"unexpected": "format"}
        mock_post.return_value = mock_response

        response = self.client.post(
            self.url,
            {"messages": [{"role": "user", "content": "Hi"}]},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_502_BAD_GATEWAY)

    def test_chat_requires_no_authentication(self):
        self.client.credentials()
        response = self.client.post(
            self.url,
            {"messages": [{"role": "user", "content": "Hi"}]},
            format="json",
        )
        self.assertNotEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertNotEqual(response.status_code, status.HTTP_403_FORBIDDEN)
