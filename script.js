fetch('./data.json')
  .then((res) => res.json())
  .then((res) => draw(res.services))
  .then(() => hideHandler())

let graph = []
let nodeList = []
let closedList = JSON.parse(localStorage.getItem('closedList')) || []

const draw = (data) => {
  data.forEach(({ head }) => {
    const nesting = []
    if (head) {
      nesting.push(head)

      const parent = (head) => {
        const parentHead = data.find((el) => el.id === head).head
        if (parentHead) {
          nesting.unshift(parentHead)
          parent(parentHead)
        }
      }

      parent(head)
    }

    graph.push(nesting)
  })

  const main = document.getElementById('main')
  data.forEach((el) => nodeList.push(createRow(el)))
  nodeList.forEach((element, index) => {
    element.style.paddingLeft = `${graph[index].length * 23}px`
    main.appendChild(element)
  })
}

const createRow = ({ id, name, node }) => {
  const title = document.createElement('div')
  const row = document.createElement('p')

  title.classList.add('center')
  title.innerText = `${name}`

  row.classList.add('child')
  node && row.appendChild(drawArrow(id))
  row.appendChild(title)

  return row
}

const drawArrow = (id) => {
  const node = document.createElement('div')
  const arrow = document.createTextNode('\u21e8')
  node.appendChild(arrow)
  node.classList.add(closedList.indexOf(id) > -1 ? 'arrow-right' : 'arrow-down')
  node.addEventListener('click', () => toggler())

  const toggler = () => {
    if (closedList.indexOf(id) === -1) {
      closedList.push(id)
      node.classList.remove('arrow-down')
      node.classList.add('arrow-right')
    } else {
      closedList = closedList.filter((el) => el !== id)
      node.classList.remove('arrow-right')
      node.classList.add('arrow-down')
    }

    localStorage.setItem('closedList', JSON.stringify(closedList))
    hideHandler()
  }
  return node
}

const hideHandler = () => {
  const hideCheck = (nesting) => {
    for (let n of nesting) {
      if (closedList.indexOf(n) > -1) return true
    }

    return false
  }

  nodeList.forEach((node, index) => {
    if (hideCheck(graph[index])) node.classList.add('hidden')
    else node.classList.remove('hidden')
  })
}
