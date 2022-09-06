import 'dotenv/config'
import { setupApp } from './config/app'

const app = setupApp()
const port = process.env.APP_PORT || '3000'

app.listen(port, () => {
  process.stdout.write(`Server running on port ${port}\n`)
})
