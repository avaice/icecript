export const movePage = (title: string, id?: string) => {
  if (id && !id.match(/^[a-zA-Z0-9_]+$/)) {
    return false
  }
  const currentUrl = new URL(window.location.href)
  const searchParams = new URLSearchParams(currentUrl.search)

  if (id) {
    searchParams.set('id', id)
  }
  const paramString = id ? `?${searchParams.toString()}` : ''
  history.pushState(null, '', paramString)
  document.title = title
}
