const paletteColors = document.querySelector('.list')
const listColors = document.querySelector('.clipboard__list')
const clearBtn = document.querySelector('.fa-trash')
const changeColorBtn = document.querySelector('.fa-droplet')
const numberInput = document.querySelector('#inputNumber')
const colorInput = document.querySelector('#inputColor')

let numberInputValue = numberInput.value
let setColorBgValue = colorInput.value
document.addEventListener('keydown', event => {
  if (event.code.toLowerCase() === 'space') {
    setRandomColors()
  }
})

numberInput.addEventListener('input', e => {
  numberInputValue = e.target.value
  paletteColors.replaceChildren()
  getPaletteColors()
  setRandomColors()
})

const getPaletteColors = () => {
  for (let i = 0; i < numberInputValue; i++) {
    const itemPalette = document.createElement('li')
    itemPalette.classList.add('list__item')
    itemPalette.innerHTML = `
          <h2 data-type="copy"></h2>
          <i class="fa-solid fa-lock-open" data-type="lock"></i>
          <p>Copy to clipboard</p>
    `
    paletteColors.append(itemPalette)
  }
}
getPaletteColors()

document.addEventListener('click', event => {
  const type = event.target.dataset.type
  if (type === 'lock') {
    event.target.classList.toggle('fa-lock-open')
    event.target.classList.toggle('fa-lock')
  } else if (type === 'copy') {
    copyToClipboard(event.target.textContent).then(() => {
      const parent = event.target.parentElement
      parent.lastElementChild.classList.add('active')
      setTimeout(() => {
        parent.lastElementChild.classList.remove('active')
      }, 1000)
    })
  }
})

const setTextColor = (text, color) => {
  const luminance = chroma(color).luminance()
  text.style.color = luminance > 0.5 ? 'black' : 'white'
}

const copyToClipboard = text => {
  addToSelectedColors(text)
  return navigator.clipboard.writeText(text)
}

const addToSelectedColors = text => {
  const itemColorElem = document.createElement('li')
  itemColorElem.id = text.substring(1)
  const itemColorImg = document.createElement('span')
  itemColorImg.style.background = text
  const itemColorText = document.createElement('span')
  const itemTextNode = document.createTextNode(text)
  itemColorText.appendChild(itemTextNode)
  itemColorElem.append(itemColorImg)
  itemColorElem.append(itemColorText)

  if (!listColors.hasChildNodes()) {
    listColors.append(itemColorElem)
  } else {
    const arrId = []
    const children = listColors.childNodes
    children.forEach(item => {
      arrId.push(item.id)
    })
    if (arrId.includes(itemColorElem.id)) {
      return false
    } else {
      listColors.append(itemColorElem)
    }
  }
}

clearBtn.addEventListener('click', () => {
  listColors.replaceChildren()
})

const setRandomColors = isInitial => {
  const items = document.querySelectorAll('.list__item')
  if (isInitial) {
    setColor()
  }
  let colors = isInitial ? getColorsFromHash() : []
  items.forEach((item, index) => {
    const codeColor = item.querySelector('h2')
    const trigger = item.querySelector('i')
    const isLocked = item.querySelector('i').classList.contains('fa-lock')
    if (isLocked) {
      colors = [...colors, codeColor.textContent]
      return
    }
    const color = isInitial
      ? colors[index]
        ? colors[index]
        : chroma.random()
      : chroma.random()
    if (!isInitial) {
      colors = [...colors, color]
    }
    codeColor.textContent = color
    item.style.background = color
    setTextColor(codeColor, color)
    setTextColor(trigger, color)
  })
  updateColorsHash(colors)
}
const updateColorsHash = (colors = []) => {
  document.location.hash = colors
    .map(color => color.toString().substring(1))
    .join('-')
}
const getColorsFromHash = () => {
  if (document.location.hash.length > 1) {
    return document.location.hash
      .substring(1)
      .split('-')
      .map(color => `#${color}`)
  }
  return []
}
changeColorBtn.addEventListener('click', () => setRandomColors())

colorInput.addEventListener('input', e => {
  setColorBgValue = e.target.value
  setColor()
})

const setColor = () => {
  const colorInputBg = document.querySelector('.color__input-bg')
  colorInputBg.style.background = setColorBgValue
}

setRandomColors(true)
