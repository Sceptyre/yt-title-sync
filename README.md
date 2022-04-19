# Youtube Top Comment to Title Sync

This can be seen live at: https://youtu.be/Pu1jEIFm3q4


# Flow
Authenticate against the YT OAuth2 API(making sure to use offline mode for refresh tokens)
See here: https://developers.google.com/youtube/v3/guides/authentication

Every 10 minutes:
  - Pull top comment from the channel page
  - Update the video and description with relevant data
