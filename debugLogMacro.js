// v4.4
function LogFactory(tag, parent, id = String(Math.random()).slice(2), head = n => `[${tag} ${id}]${n && parent ? parent.h(--n) : ""}`, generator = n => (...v) => console.log(head(n), ...v), Log = generator(0)) {
  Log.h = head
  /** Log with parent*/
  Log.t = generator(1)
  /** Log with stack */
  Log.s = generator(-1)
  return Log
}