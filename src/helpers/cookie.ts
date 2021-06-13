const cookie = {
  get(name: string): string | null {
    const reg = new RegExp(`(^|;\\s*)(${name})=([^;]*)`)
    const match = document.cookie.match(reg)
    return match ? match[3] : null
  }
}

export default cookie
