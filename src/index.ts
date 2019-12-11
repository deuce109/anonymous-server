import { Server } from './server'


const server: Server = new Server(
  'redis://localhost:6379',
)

server.addSocketListener('test', (data) => {
  console.log(data)
})

server.listen(parseInt(process.env.PORT, 10) || 3030)
