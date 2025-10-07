import {useEffect, useState, useCallback, useMemo} from 'react'
import PropTypes from 'prop-types'
import {client, urlFor} from '../sanity/client'

// Updated to reflect the new schema name 'galleryItem' and include ordering & published filter.
const galleryQuery = `*[_type == "galleryItem" && (published == true || !defined(published))] | order(order asc, title asc){
  _id,
  title,
  description,
  alt,
  order,
  tags,
  image,
  "imageUrl": image.asset->url
}`

export function Gallery({title = 'Gallery'}) {
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeIndex, setActiveIndex] = useState(-1)
  const [activeTag, setActiveTag] = useState(() => sessionStorage.getItem('gallery_active_tag') || 'All')

  const openLightbox = useCallback((idx) => {
    setActiveIndex(idx)
    // prevent body scroll when open
    document.documentElement.style.overflow = 'hidden'
  }, [])

  const closeLightbox = useCallback(() => {
    setActiveIndex(-1)
    document.documentElement.style.overflow = ''
  }, [])

  const showPrev = useCallback(() => {
    setActiveIndex(i => (i <= 0 ? items.length - 1 : i - 1))
  }, [items.length])

  const showNext = useCallback(() => {
    setActiveIndex(i => (i >= items.length - 1 ? 0 : i + 1))
  }, [items.length])

  useEffect(() => {
    if (activeIndex === -1) return
    function onKey(e) {
      if (e.key === 'Escape') closeLightbox()
      else if (e.key === 'ArrowLeft') showPrev()
      else if (e.key === 'ArrowRight') showNext()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [activeIndex, closeLightbox, showPrev, showNext])

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

  const allTags = useMemo(() => {
    const tagSet = new Set()
    items.forEach(item => {
      if (Array.isArray(item.tags)) item.tags.forEach(t => t && tagSet.add(t))
    })
    return ['All', ...Array.from(tagSet).sort((a, b) => a.localeCompare(b))]
  }, [items])

  const visibleItems = useMemo(() => {
    if (activeTag === 'All') return items
    return items.filter(i => Array.isArray(i.tags) && i.tags.includes(activeTag))
  }, [items, activeTag])

  useEffect(() => {
    sessionStorage.setItem('gallery_active_tag', activeTag)
  }, [activeTag])

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
      {allTags.length > 1 && (
        <div className="gallery__filters" role="toolbar" aria-label="Filter gallery by tag">
          <ul>
            {allTags.map(tag => (
              <li key={tag}>
                <button
                  type="button"
                  className={tag === activeTag ? 'active' : ''}
                  aria-pressed={tag === activeTag}
                  onClick={() => setActiveTag(tag)}
                >
                  {tag}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="gallery__grid" data-count={visibleItems.length}>
        {visibleItems.map(({_id, title: itemTitle, description, imageUrl, alt}, idx) => (
          <figure key={_id} className="gallery__item">
            {imageUrl ? (
              <button
                className="gallery__thumb"
                onClick={() => openLightbox(idx)}
                aria-label={`Open image ${itemTitle || alt || ''}`.trim()}
              >
                <img src={imageUrl} alt={alt || itemTitle || 'Gallery item'} loading="lazy" />
              </button>
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
      {activeIndex > -1 && visibleItems[activeIndex] && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label="Image viewer">
          <div className="lightbox__backdrop" onClick={closeLightbox} />
          <div className="lightbox__content">
            <button className="lightbox__close" aria-label="Close viewer" onClick={closeLightbox}>×</button>
            <button className="lightbox__nav prev" aria-label="Previous image" onClick={showPrev}>‹</button>
            <figure>
              <img
                src={visibleItems[activeIndex].imageUrl}
                alt={visibleItems[activeIndex].alt || visibleItems[activeIndex].title || 'Large view'}
              />
              <figcaption>
                {visibleItems[activeIndex].title && <h2>{visibleItems[activeIndex].title}</h2>}
                {visibleItems[activeIndex].description && <p>{visibleItems[activeIndex].description}</p>}
                <p className="lightbox__meta">{activeIndex + 1} / {visibleItems.length}</p>
              </figcaption>
            </figure>
            <button className="lightbox__nav next" aria-label="Next image" onClick={showNext}>›</button>
          </div>
        </div>
      )}
    </section>
  )
}

Gallery.propTypes = {
  title: PropTypes.string,
}
