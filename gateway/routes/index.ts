import { Router } from 'express'
import { AxiosAdapter } from '../adapters'

export default (router: Router) => {
  const api = new AxiosAdapter()

  router.post('/user', async (req, res) => {
    const url = api.build({
      baseUrl: process.env.CUSTOMER_URL,
      uri: ['user'],
    })
    const { status, body } = await api.request({
      method: 'post',
      url,
      body: req.body,
    })
    res.status(status).json(body)
  })

  router.get('/users', async (req, res) => {
    const url = api.build({
      baseUrl: process.env.CUSTOMER_URL,
      uri: ['users'],
    })
    const { status, body } = await api.get(url)
    res.status(status).json(body)
  })
}
