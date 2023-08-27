export const setTitle = (title?: string) => {
  if (!title) {
    title = document.getElementsByTagName('h1')[0].innerText
  }
  document.title = title
}
