import { Router } from 'express'
import { AxiosAdapter } from '../adapters'

export default (router: Router) => {
  const api = new AxiosAdapter()

  router.post('/order', async (req, res) => {
    const url = api.build({
      baseUrl: process.env.ORDER_URL,
      uri: ['order'],
    })
    const { status, body } = await api.request({
      method: 'post',
      url,
      body: req.body,
    })
    return res.status(status).json(body)
  })
}
