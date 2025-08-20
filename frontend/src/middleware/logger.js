const LOGGING_ENDPOINT = "http://20.244.56.144/evaluation-service/logs";
const ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiIyMjE3MDEwQG5lYy5lZHUuLmFjLmluIiwiZXhwIjoxNzU1NjY2NDAxLCJpYXQiOjE3NTU2NjU1MDEsImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBQcml2YXRlIExpbWl0ZWQiLCJqdGkiOiJhMjFmNDdhMi0wOWI5LTQ0MDAtOGI4NC1lNjM0MDNiMzRkMiIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6Im1hbGFpYXJhc3UgZyIsInN1YiI6ImJmOWZjNmI3LWUxZWUtNDM0Ni04NTQ5LWI3Mzg1OTU4NTdkOCJ9LCJlbWFpbCI6IjIyMTcwMTBAbmVjLmVkdS5pbiIsIm5hbWUiOiJtYWxhaXRhcmFzdSBnIiwicm9sbE5vIjoiMjIxNzAxMCIsImFjY2Vzc0NvZGUiOiJ4c1pUVG4iLCJjbGllbnRJRCI6ImJmOWZjNmI3LWUxZWUtNDM0Ni04NTQ5LWI3Mzg1OTU4NTdkOCIsImNsaWVudFNlY3JldCI6IlVZakdYU1hnSmtaalhleSJ9.HS7e-nwYj4yGQgfT8WI3aMXW4FFXIjYmbV0oqONqQOQ"; // This token is directly from your prompt.

export const log = async (stack, level, packageName, message) => {
  try {
    const response = await fetch(LOGGING_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
      },
      body: JSON.stringify({
        stack,
        level,
        package: packageName,
        message,
      }),
    });

    if (!response.ok) {
      console.error('Failed to send log:', response.statusText);
    }
  } catch (error) {
    console.error('Error sending log:', error);
  }
};
