const axios = require('axios')
const fs = require('fs')

const apiKey = "Ajeaw8nDCi5Mt7j4CkYezCNVOZmidpoukKnu7CNlTtesfB4fQQbXzAJBJGNKGUwJ";

async function autoSave(projectId) {
    const config = {
        headers: {
            "Authorization": `UserApiKey ${apiKey}`
        }
    }

    const res = await axios.get(`${process.env.OT_SERVER_URL}/domains/convergence/default/models/${projectId}`, config)
    const files = res.data.body.data.tree.nodes.root.children;
    files.map(async (file)=>{
        const fileRes = await axios.get(`${process.env.OT_SERVER_URL}/domains/convergence/default/models/${file}`, config)
        const filename = res.data.body.data.tree.nodes[file].name
        fs.writeFile(`/home/user/${filename}`, fileRes.data.body.data.content+"\n", (err, data)=>{
            if(err)
                console.log(err)
        })
    })
}

module.exports = autoSave