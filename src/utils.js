export default {
  name: 'utils',
  h: 0,
  randColor() {
    this.h = (this.h + 90 + Math.round(20 * Math.random())) % 360
    return {
      h: this.h,
      s: Math.round(60 + 40 * Math.random()),
      l: Math.round(40 + 20 * Math.random())
    }
  }
}
