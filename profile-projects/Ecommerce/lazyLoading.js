export const option = {
  rootMargin: '700px 0px 700px 0px'
}

function onViewEntry(entries, observer) {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return
    const img = entry.target
    const src = img.getAttribute('data-src')
    img.setAttribute('src', src)
    img.removeAttribute('data-src')
    observer.unobserve(img)
  })
}

export default onViewEntry
