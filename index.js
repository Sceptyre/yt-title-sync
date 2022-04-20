require('dotenv').config()
const YT = require('./lib/yt')

const yt = new YT(
    process.env["YT_CLIENT_ID"],
    process.env["YT_CLIENT_SECRET"],
    process.env["YT_ACCESS_CODE"]
)

async function main() {
    var topComment;
    var description;
    var title;
    await yt.init()

    while(true) {
        await yt.reloadToken();
        try {
            topComment = await yt.getTopComment(process.env["YT_VIDEO_ID"]);
            console.log(topComment)

            title = topComment.textDisplay.slice(0,70).replace(/[^a-zA-Z ]/g, "")
            description = `[Current Title By]\n${topComment.authorDisplayName}\n${topComment.authorChannelUrl}\n\n` +
            `[Full Message]\n`+
            `${topComment.textOriginal}\n\n`+
            `Make your comment the most relevant to make it the title and get tagged in the description\n` +
            `Note: Youtube titles are limited to 70 characters\n\n` +
            `The Youtube comment system depends on four things:\n` + 
            `- Post Time\n` +
            `- Like/Dislikes\n` +
            `- Reply Count\n` +
            `- The Poster\n\n`+
            `Last Updated: ${new Date().toUTCString()}\n`

            await yt.updateVideo(
                process.env["YT_VIDEO_ID"],
                title,
                description = description
            )
        } catch (e) {
            console.log("Failed to pull top comment and update title:\n" + e)
        }

        await new Promise(r => setTimeout(r, 600000));
    }
}

main().then(()=>console.log('done'))
