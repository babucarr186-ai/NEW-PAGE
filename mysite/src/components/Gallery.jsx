import {useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import {client, urlFor} from '../sanity/client'

// Updated to reflect the new schema name 'galleryItem' and include ordering & published filter.
const galleryQuery = `*[_type == "galleryItem" && (published == true || !defined(published))] | order(order asc, title asc){
  _id,
  title,
  description,
  alt,
  order,
  image,
  "imageUrl": image.asset->url
}`

export function Gallery({title = 'Gallery'}) {
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true

    async function loadGallery() {
      try {
        setIsLoading(true)
        const data = await client.fetch(galleryQuery)

        if (!isMounted) {
          return
        }

        const withUrls = data.map((item) => ({
          ...item,
          imageUrl: item.imageUrl || (item.image ? urlFor(item.image).width(1200).url() : null),
        }))

        setItems(withUrls)
        setError(null)
      } catch (err) {
        console.error('Failed to load gallery', err)
        setError('Unable to load images right now. Please try again later.')
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadGallery()

    return () => {
      isMounted = false
    }
  }, [])

  if (isLoading) {
    return <p className="status">Loading gallery…</p>
  }

  if (error) {
    return <p className="status error">{error}</p>
  }

  if (!items.length) {
    return <p className="status">No images yet. Add one in Sanity Studio to see it here!</p>
  }

  return (
    <section className="gallery">
      <header className="gallery__header">
        <h1>{title}</h1>
        <p>Updates automatically from Sanity Studio. Add or edit entries with zero code.</p>
      </header>
      <div className="gallery__grid">
        {items.map(({_id, title: itemTitle, description, imageUrl, alt}) => (
          <figure key={_id} className="gallery__item">
            {imageUrl ? (
              <img src={imageUrl} alt={alt || itemTitle || 'Gallery item'} loading="lazy" />
            ) : (
              <div className="gallery__placeholder">No image</div>
            )}
            <figcaption>
              {itemTitle && <h2>{itemTitle}</h2>}
              {description && <p>{description}</p>}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}

Gallery.propTypes = {
  title: PropTypes.string,
}
