import { Server } from './server'


const server: Server = new Server(
  process.env.CONNECTION_STRING,
)

server.listen(parseInt(process.env.PORT, 10) || 3030)
