export const applyDrag = (arr, dragResult) => {
  const { removedIndex, addedIndex, payload } = dragResult
  if (removedIndex === null && addedIndex === null) return arr

  const result = [...arr]
  let itemToAdd = payload

  if (removedIndex !== null) {
    itemToAdd = result.splice(removedIndex, 1)[0]
  }

  if (addedIndex !== null) {
    result.splice(addedIndex, 0, itemToAdd)
  }

  return result
}

export const generateItems = (count, creator) => {
  const result = []
  for (let i = 0; i < count; i++) {
    result.push(creator(i))
  }
  return result
}

export const generateList = (creator) => {
    const result = []
    const todos_JSON = localStorage.getItem('todos')
    if(!todos_JSON) {
      localStorage.setItem('todos', result)
      
    } else {
      const todos_obj = JSON.parse(todos_JSON);

      const todos = todos_obj.children[creator].children;
      
      for (let i = 0; i < todos.length; i++) {
          result.push({
              type: 'draggable',
              id: `${creator}${i}`,
              props: {
                  className: 'card'
              },
              data: { 
                  content: todos[i].data.content,
                  image: todos[i].data.image,
                  editing: false,
              }
          })
      }
    }
    return result
}



export function makeItem (content, image, id = null) {
  let randomId = Math.random().toString(36).substring(7)
  id = id || randomId
  return { id, content, image }
}

export function getItem (lists, itemRef, returnList) {
  let list, item
  const id = typeof itemRef === 'object'
    ? itemRef.id
    : itemRef
  for (list of lists) {
    item = list.items.find(item => item.id === id)
    if (item) {
      break
    }
  }
  return returnList
    ? { list, item }
    : item
}