
import Fastify from 'fastify'

const app = Fastify()
app.get('/', async () => {
  return { message: 'Hello, World!' }
})

app.listen({ port: 3000 }, () => {
  console.log('Server is running on port 3000')
})
