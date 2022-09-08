import 'dotenv/config'
import { App } from './app'

const app = new App()
const port = process.env.APP_PORT || '3000'

app.listen(port)
