import { Router } from 'express'
import { AxiosAdapter } from '../adapters'

export default (router: Router) => {
  const api = new AxiosAdapter()

  router.post('/product', async (req, res) => {
    const url = api.build({
      baseUrl: process.env.PRODUCT_URL,
      uri: ['product'],
    })
    const { status, body } = await api.request({
      method: 'post',
      url,
      body: req.body,
    })
    res.status(status).json(body)
  })

  router.get('/product/:productId', async (req, res) => {
    const url = api.build({
      baseUrl: process.env.PRODUCT_URL,
      uri: ['product', req.params.productId],
    })
    const { status, body } = await api.get(url)
    res.status(status).json(body)
  })

  router.get('/products', async (req, res) => {
    const url = api.build({
      baseUrl: process.env.PRODUCT_URL,
      uri: ['products'],
    })
    const { status, body } = await api.get(url)
    res.status(status).json(body)
  })
}
