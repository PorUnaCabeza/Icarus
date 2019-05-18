const { Wechaty } = require('wechaty') // import { Wechaty } from 'wechaty'
const mysql = require('./src/db/mysqlUtil')
const sql = require('./src/db/sql')
const idWorker = require('./src/utils/idWorker')
const date = require('./src/utils/date')

let ROOM_ID = '@@'
let MEMBER = {}
const DATE_FORMATE = 'yyyy-MM-dd HH:ss:mm'

const bot = new Wechaty({ profile: 'cabeza_bot' })
global.bot = bot
const dealMessage = function(message) {
  let data = message.payload
  let { type, id, text, timestamp, roomId } = data
  if (type != '7') return
  if (roomId != ROOM_ID) return
  let userName = (message.from().toString() || '').replace(/Contact<(.*)>/g, '$1')
  let userId = MEMBER[userName]
  //console.log(`${userName}: ${text}, time= ${timestamp}, id = ${id}, userId = ${userId}`)
  mysql.exec(sql.saveMessage, [id, userId, userName, text, date.formatDate(timestamp + '000', DATE_FORMATE)])
}
const login = function() {
  return new Promise(function(resolve) {
    bot.on('login', user => {
      console.log(`User ${user} logined`)
      resolve(user)
    })
  })
}

bot.on('scan', (qrcode, status) =>
  console.log(`${status}: https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrcode)}`)
)
bot.on('message', dealMessage)

const updateMember = async function() {
  let roomList = await bot.Room.findAll()
  let room = roomList[0]
  ROOM_ID = room.id
  let memberList = [].concat(await room.memberAll())
  let dbList = await mysql.exec('select * from user')
  memberList.map(m => {
    let r = dbList.find(d => m.payload.name == d.name)
    if (r) m.payload.id = r.id
    else m.payload.id = idWorker.next()
    return m
  })
  let paramList = memberList.map(u => [u.payload.id, u.payload.name, '::NOW()'])
  MEMBER = memberList.reduce((a, b) => {
    a[b.payload.name] = b.payload.id
    return a
  }, {})
  console.log(MEMBER)
  await mysql.batchInsert(sql.updateUser, paramList)
}
const main = async function() {
  await bot.start()
  console.log('mysql begin')
  await mysql.init()
  console.log('mysql 初始化完毕')
  await login()
  await updateMember()
}

main().then(() => console.log('start'))
