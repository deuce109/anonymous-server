import { Server } from './server'
import { tryCatch } from './middleware'


const server: Server = new Server(
  './db/test.db',
)
server.use(tryCatch)
server.listen(parseInt(process.env.PORT, 10) || 3030)