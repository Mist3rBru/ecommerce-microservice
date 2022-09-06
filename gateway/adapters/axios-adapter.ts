import axios, { AxiosInstance } from 'axios'
import { HttpResponse } from '../protocols'

interface BuildParams {
  baseUrl: string
  uri?: string[]
  params?: Record<string, string[]>
}

interface RequestParams {
  method: 'post' | 'put'
  url: string
  body: Record<string, any>
}

export class AxiosAdapter {
  private readonly api: AxiosInstance = axios.create({
    headers: {
      'cache-control': 'no-cache',
    },
  })

  build({ baseUrl, params, uri }: BuildParams): string {
    return [
      baseUrl,
      !/\/$/i.test(baseUrl) && uri?.length ? '/' : '',
      uri?.join('/'),
      Object.entries(params || {}).flatMap(([key, value], index) => {
        const mark = index === 0 ? '?' : '&'
        return [mark, key, '=', value.join(',')]
      }),
    ]
      .flat(Infinity)
      .join('')
  }

  async get(url: string): Promise<HttpResponse> {
    const response = await this.api.get(url)
    return {
      status: response.status,
      body: response.data,
    }
  }

  async request(params: RequestParams): Promise<HttpResponse> {
    const response = await this.api[params.method](params.url, params.body)
    return {
      status: response.status,
      body: response.data,
    }
  }
}
