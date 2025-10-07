import {createClient} from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID
const dataset = import.meta.env.VITE_SANITY_DATASET
const apiVersion = import.meta.env.VITE_SANITY_API_VERSION || '2023-10-01'
const useCdn = import.meta.env.VITE_SANITY_USE_CDN !== 'false'

if (!projectId || !dataset) {
  console.warn(
    'Missing Sanity configuration. Please set VITE_SANITY_PROJECT_ID and VITE_SANITY_DATASET in your .env file.'
  )
}

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn,
})

const builder = imageUrlBuilder(client)

export const urlFor = (source) => (source ? builder.image(source) : null)
