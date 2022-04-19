const axios = require('axios')
const fs = require('fs')

module.exports = class {
    token;
    refreshToken;

    constructor(clientId, clientSecret, authCode) {
        this.clientId = clientId
        this.clientSecret = clientSecret
        this.authCode = authCode
    }

    async getToken() {
        let res = await axios.post(
            'https://oauth2.googleapis.com/token',
            {
                code: this.authCode,
                client_id: this.clientId,
                client_secret: this.clientSecret,
                redirect_uri: "http://localhost:8080/oauth2callback",
                grant_type: "authorization_code",
                include_granted_scopes: true
            }
        )
        
        this.token = res.data.access_token
        this.refreshToken = res.data.refresh_token
        fs.writeFileSync('./rt', this.refreshToken)

        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
    }

    async reloadToken() {
        let res = await axios.post(
            'https://oauth2.googleapis.com/token',
            {
                client_id: this.clientId,
                client_secret: this.clientSecret,
                refresh_token: this.refreshToken,
                grant_type: "refresh_token"
            }
        )
        
        console.log(res.data)
        this.token = res.data.access_token

        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
    }

    async getTopComment(videoId) {
        var res;
        try {
            res = await axios.get(
                `https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet&maxResults=1&order=relevance&videoId=${videoId}`
            )
        } catch(e) {
            console.log(e.response.data)
            throw e
        }

        console.log(res.data)
        return res.data.items[0].snippet.topLevelComment.snippet
    }

    async updateVideo(id, title, description=undefined) {
        await axios.put(
            `https://youtube.googleapis.com/youtube/v3/videos?part=snippet`,
            {
                id: id,
                snippet: {
                    title: `[YTBB] ${title}`,
                    categoryId: 24,
                    description: description
                }
            }
        )
    }

    async init() {
        if(fs.existsSync('./rt')) {
            try {
                let e = fs.readFileSync('./rt')
                this.refreshToken = Buffer.from(e).toString()
                this.reloadToken()
            } catch {
                await this.getToken()
            }
        } else {
            await this.getToken()
        }
    }
}
