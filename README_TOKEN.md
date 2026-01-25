# Twitch OAuth Token Retrieval

This guide explains how to obtain a Twitch OAuth token for IRC authentication.

## Quick Start

1. **Register a Twitch Application**
   - Go to https://dev.twitch.tv/console/apps
   - Click "Register Your Application"
   - Fill in:
     - Name: Your app name (e.g., "My Twitch IRC Bot")
     - OAuth Redirect URLs: `http://localhost:3000`
     - Category: Chat Bot
   - Click "Create"
   - **Save your Client ID**

2. **Set your Client ID**
   ```bash
   export TWITCH_CLIENT_ID=your_client_id_here
   ```

3. **Run the token retrieval script**
   ```bash
   deno run --allow-net --allow-env --allow-run --allow-read --allow-write get_token.ts
   ```

4. **Authorize the application**
   - The script will automatically open your browser
   - Log in to Twitch if prompted
   - Click "Authorize"
   - The token will be automatically saved to `.env`

## What the Script Does

1. Starts an HTTP server on `http://localhost:3000`
2. Generates a secure random state for CSRF protection
3. Opens your browser with the OAuth authorization URL
4. Waits for you to authorize the application
5. Captures the token from the redirect
6. Validates the token with Twitch's API
7. Saves the token to `.env` file

## Required Scopes

The script requests these scopes for IRC authentication:
- `chat:read` - Read chat messages via IRC
- `chat:edit` - Send chat messages via IRC

## Token Format

The token is saved in the format required for IRC:
```
TWITCH_OAUTH_TOKEN=oauth:your_actual_token_here
```

When using with Twitch IRC, you'll use it as: `oauth:your_actual_token_here`

## Troubleshooting

### Port Already in Use
If port 3000 is already in use, close the application using that port and try again.

### Browser Doesn't Open
If the browser doesn't open automatically, the script will display the URL. Copy and paste it into your browser manually.

### Authorization Denied
If you deny authorization, the script will show an error. Run it again and authorize the application.

### Invalid Client ID
Make sure your `TWITCH_CLIENT_ID` environment variable is set correctly and matches your registered application.

### Token Validation Fails
If token validation fails, the token may be invalid or expired. Try running the script again to get a new token.

## Security Notes

- The `.env` file contains sensitive information and is excluded from git
- Never commit your `.env` file to version control
- Tokens expire after a few hours; you may need to refresh them periodically
- The state parameter provides CSRF protection during the OAuth flow

## Manual Method (Alternative)

If you prefer to get the token manually:

1. Build this URL (replace `YOUR_CLIENT_ID`):
   ```
   https://id.twitch.tv/oauth2/authorize?response_type=token&client_id=YOUR_CLIENT_ID&redirect_uri=http://localhost:3000&scope=chat%3Aread%20chat%3Aedit&state=random_string
   ```

2. Open it in your browser and authorize

3. Extract the token from the redirect URL fragment:
   - Look for `access_token=YOUR_TOKEN` in the URL
   - Copy the token value

4. Save it to `.env`:
   ```
   TWITCH_CLIENT_ID=your_client_id
   TWITCH_OAUTH_TOKEN=oauth:your_token
   ```
