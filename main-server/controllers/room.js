const docker = require('../utils/docker')
const { v4: uuidv4 } = require('uuid')
const { User } = require('../models/User')
const Room = require('../models/Room')
const { response } = require('express')
const { isUUID } = require('validator')
const mysql = require('../configs/db')

const spinDockerContainer = async(req, res) => {
    try {
        if (!req.body.roomName) {
            return res.status(400).json({ status: "specify room name" })
        }

        const user = await mysql.query(' SELECT * FROM User WHERE email= ? ', [req.user.email])

        const newRoom = {
            roomName: req.body.roomName,
            host: user._id
        }
        let room
        let response

        try {
            if (await mysql.query('SELECT COUNT(id) FROM Room WHERE roomName= ? ', [req.body.roomName])) {
                return res.status(409).json({ status: "room_name_duplicate" });
            }
            
            const sql = "INSERT INTO Room (roomName, host) VALUES (?, ?)";

            room = await mysql.query(sql, [newRoom.roomName, newRoom.host])

        } catch (e) {
            console.log(e)
            return res.status(400).json({ "status": "error" })
        }

        const spawnImage = await docker.createRoom(
            process.env.USER_SERVER_IMAGE,
            room._id,
            process.env.USER_SERVER_MEM_LIMIT,
            process.env.USER_SERVER_CPU_LIMIT,
            process.env.USER_SERVER_URL,
            process.env.USER_SERVER_NETWORK)

        if (spawnImage.status === 'created') {
           
            var sql = "UPDATE Room SET roomURL = ? WHERE id = ?"
            response = await mysql.query(sql, [spawnImage.roomURL, room.id])

            setTimeout(() => {
                return res.status(201).json(response)
            }, 1000)
        } else {

            var sql = "UPDATE Room SET status = ? WHERE id = ? "
            response = await mysql.query(sql, ["error", room._id])

            if(response){
                return res.status(400).json({ status: "error" })
            }
            
        }

    } catch (e) {
        console.log(e)
        res.status(400).json({ status: "error" })
    }
}

const checkRoomName = async(req, res) => {
    if (!req.body.roomName) {
        return res.status(400).json({ isValid: "false" })
    }
    const newRoomName = req.body.roomName

    const room = await mysql.query(' SELECT * FROM Room WHERE roomName= ? ', [newRoomName])

    if (room)
        return res.status(200).json({ "isValid": false })
    return res.status(200).json({ "isValid": true })
}

const getRooms = async(req, res) => {
    try {
        const user = await mysql.query(' SELECT * FROM User WHERE email= ? ', [req.user.email])

        let response = []

        // rooms where user is admin
        await mysql.query(' SELECT * FROM Room WHERE host= ? ', [user.id ], (err, doc) => {
            doc.map((x) => {
                response.push({
                    roomName: x.roomName,
                    inviteCode: x.inviteCode,
                    roomURL: x.roomURL,
                    isHost: true,
                    roomId: x._id
                })
            })
        })

        const rooms = await mysql.query('SELECT room_id FROM Participant WHERE user_id = ?', [user.id])
        rooms.map((x) => {
            response.push({
                roomName: x.roomName,
                inviteCode: x.inviteCode,
                roomURL: x.roomURL,
                isHost: false
            })
        })

        .then(() => {
                return res.status(200).json({ status: "success", rooms: response })
            })
    } catch (e) {
        return res.status(400).json({ status: "error" })
    }


}

const joinRoom = async(req, res) => {
    const inviteCode = req.query.inviteCode
    let response;

    if (isUUID(inviteCode)) {
        try {
            const user = await mysql.query(' SELECT * FROM User WHERE email= ? ', [req.user.email])
            const userId = user.id
            const room = await mysql.query(' SELECT * FROM Room WHERE inviteCode= ? ', [inviteCode])

            //check if user is host
            if (room.host.toString() == userId.toString()) {
                return res.status(409).json({ status: 'already_joined' })
            }

            //check if user is participant
            if (room.participants.indexOf(userId) > -1) {
                return res.status(409).json({ status: 'already_joined' })
            }



            const sql = "INSERT INTO Participant (user_id, room_id) VALUES (?, ?)";
            await mysql.query(sql, [userId, room.id])


            response = {
                status: 'room_joined',
                roomName: room.roomName,
                inviteCode: room.inviteCode,
                roomURL: room.roomURL,
                roomId: room._id
            }
            return res.json(response)


        } catch (e) {
            console.log(e)
            return res.status(400).json({ status: "error" })

        }
    }

    return res.status(400).json({ status: 'invite_code_not_valid' })
}

const getRoomInfo = async(req, res) => {
    const inviteCode = req.params.inviteCode
    console.log(req.user)
    const email = req.user.email

    if (isUUID(inviteCode)) {
        const user = await mysql.query(' SELECT * FROM User WHERE email= ? ', [email])

        const userId = user._id

        let room = await mysql.query(' SELECT * FROM Room WHERE host= ? ', [user.id ])

        if (room)
            return res.json(room)

        rooms = await mysql.query('SELECT room_id FROM Participant WHERE user_id = ? AND inviteCode = ?', [user.id, inviteCode])

        if (room)
            return res.json(room)

        return res.status(400).json({ status: "error" })


    }

    return res.status(400).json({ status: "error" })



}

module.exports = {
    spinDockerContainer,
    checkRoomName,
    getRooms,
    joinRoom,
    getRoomInfo
}