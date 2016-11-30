IS = require './is.js'

root = window
Tiras = {}
doc = root.document
Tiras._indexOf = (array, obj) ->
  if Array::indexOf
    return Array::indexOf.call(array, obj)
  i = 0
  j = array.length
  while i < j
    if array[i] == obj
      return i
    i++
  -1

Tiras.isLiteralObject = (object) ->
  object and IS.object object and Object.getPrototypeOf object is Object.getPrototypeOf({})

Tiras.isIterable = (object) ->
  return false if IS.domNode object or Tiras.isElement object or object is root
  Tiras.isLiteralObject object or IS.array object or (IS.object object and object isnt null and not IS.undefined object["length"])


Tiras.eachElement = (object, callback) ->
  if IS.array object or IS.object object and not IS.undefined object['length']
    callback.apply ob, [ob, i] for ob, i in object
  if Tiras.isLiteralObject(object)
    callback.apply key, [key, i] for key, i in object
  return

Tiras.getStyle = (element, prop) ->
  if IS.function root.getComputedStyle
    computedStyle = root.getComputedStyle(element)
  else if IS.undefined doc.currentStyle
    computedStyle = element.style
  else
    computedStyle = element.currentStyle
  if prop then computedStyle[prop] else computedStyle


cssNameProperty = (prop) ->
  prop

Tiras.isElement = (element) ->
  return element instanceof HTMLElement  if typeof HTMLElement is "object"
  element and typeof element is "object" and element.nodeType is 1 and typeof element.nodeName is "string"

Tiras.find = (selector, element) ->
  result = []
  if IS.domNode element
    result = element.querySelectorAll(selector)
  else
    result = doc.querySelectorAll(selector)
  result

Tiras.id = (id) ->
  doc.getElementById id

Tiras.findByTagName = (name) ->
  doc.getElementsByTagName name

Tiras.findByClass = (name) ->
  name = name.substring(1) if name.substring(0, 1) is "."
  return doc.getElementsByClassName(name)  if doc.getElementsByClassName
  doc.querySelectorAll "." + name  if doc.querySelector and doc.querySelectorAll

Tiras.offset = (element) ->
#  console.log element
  throw new Error "#{element} is not a DOMNode object" unless IS.domNode element
  return false unless Tiras.isElement element
  rect = element.getBoundingClientRect()
  offset =
    top: Math.round rect.top
    right: Math.round rect.right
    bottom: Math.round rect.bottom
    left: Math.round rect.left
    width: (if rect.width then Math.round(rect.width) else Math.round(element.offsetWidth))
    height: (if rect.height then Math.round(rect.height) else Math.round(element.offsetHeight))

  offset.width = parseFloat(Tiras.getStyle(element, "width"))  if offset.width <= 0
  offset.height = parseFloat(Tiras.getStyle(element, "height"))  if offset.height <= 0
  offset

Tiras.width = (element) ->
  Tiras.offset(element).width

Tiras.height = (element) ->
  Tiras.offset(element).height

Tiras.parent = (element) ->
  throw new Error "#{element} is not a DOMNode object" unless IS.domNode element
  element.parentNode

Tiras.children = (element, tag) ->
  return element.childNodes  if typeof tag is "boolean" and tag
  result = []
  if IS.string tag
    i = 0
    j = element.childNodes.length

    while i < j
      result.push element.childNodes[i]  if element.childNodes[i].nodeName.toLowerCase() is tag.toLowerCase()
      i++
    return result
  for i of element.childNodes
    result.push element.childNodes[i]  if element.childNodes[i].nodeType is 1
  result

Tiras.next = (element) ->
  throw new Error "#{element} is not a DOMNode object" unless IS.domNode element
  result = element.nextSibling
  return Tiras.next(result) unless result.nodeType is 1
  result

Tiras.previous = (element) ->
  throw new Error "#{element} is not a DOMNode object"  unless IS.domNode element
  result = element.previousSibling
  return Tiras.previous result unless result.nodeType is 1
  result

Tiras.attribute = (element, attribute, listener) ->
  throw new Error "#{element} is not a DOMNode object" unless IS.domNode element
  if typeof attribute is "string"
    result = undefined
    if attribute is "class" and not IS.undefined element["className"]
      result = element.className
    else if attribute is "for" and not IS.undefined element["htmlFor"]
      result = element.htmlFor
    else if attribute is "value" and not IS.undefined element["value"]
      result = element.value
    else
      result = element.getAttribute attribute
    result = null  if result is ""
    return result
  if IS.array attribute
    return result[atr] = Tiras.attribute element, atr for atr, i in attribute
  if Tiras.isLiteralObject attribute
    for i of attribute
      if attribute[i] is null
        element.removeAttribute i
      else
        element.setAttribute i, attribute[i]
    return attribute
  if IS.function listener
    listener()
  false

Tiras.css = (element, style) ->
  if IS.array element and Tiras.isLiteralObject(style)
    Tiras.eachElement element, (e) ->
      Tiras.css e, style
      return

    return Tiras
  throw new Error "#{element} is not a DOMNode object" unless IS.domNode element
  return Tiras.getStyle(element, cssNameProperty(style)) if IS.string style
  if IS.array style
    return (Tiras.getStyle(element, cssNameProperty(s)) for s in style)
  if Tiras.isLiteralObject(style)
    for i of style
      element.style[cssNameProperty(i)] = style[i]
    return style
  false

Tiras.setAttr = (element, attribute, value, listener)->
  element.setAttribute attribute, value
  if IS.function listener
    listener()
  return

Tiras.getClass = (element) ->
  throw new Error "#{element} is not a DOMNode object" unless IS.domNode element
  attribute = Tiras.attribute(element, "class")
  return [] unless attribute
  attribute = attribute.split(" ")
  classNames = []
  for i of attribute
    continue if attribute[i] is ""
    classNames.push attribute[i]
  classNames

Tiras.hasClass = (element, className) ->
  throw new Error "#{element} is not a DOMNode object" unless IS.domNode element
  if IS.string className
    return (if Tiras._indexOf(Tiras.getClass(element), className) > -1 then true else false)
  else if IS.array className
    elementClasses = Tiras.getClass element
    for i of className
      return false  if Tiras._indexOf className[i], elementClasses is -1
    return true
  else
    return false
  false

Tiras.addClass = (element, className, listener) ->
  throw new Error "first parameter cannot be undefined" if IS.undefined element
  if IS.array element
    Tiras.eachElement element, (e) ->
      Tiras.addClass e, className
      return

    return Tiras
  throw new Error "#{element} is not a DOMNode object" unless IS.domNode element
  if IS.array className
    for i of className
      Tiras.addClass element, className[i], listener
    return Tiras
  classes = Tiras.getClass element
  classes.push className  if Tiras._indexOf classes, className is -1
  classes = classes.join " "
  Tiras.attribute element,
    class: classes
  if IS.function listener
    listener()
  return

Tiras.toggleClass = (element, className, listener) ->
  throw new Error "#{element} is not a DOMNode object" unless IS.domNode element
  if element.classList
    element.classList.toggle className
  else
    classes = element.className.split " "
    existingIndex = classes.indexOf className
    if existingIndex >= 0
      classes.splice existingIndex, 1
    else
      classes.push className
    element.className = classes.join " "

Tiras.removeClass = (element, className, listener) ->
  throw new Error "first parameter cannot be undefined" if IS.undefined element
  if IS.array element
    Tiras.eachElement element, (e) ->
      Tiras.removeClass e, className
      return

    return Tiras
  throw new Error "#{element} is not a DOMNode object" unless IS.domNode element
  if IS.array className
    for i of className
      Tiras.removeClass element, className[i], listener
    return Tiras
  unless className
    return Tiras.attribute element, class: null
  classes = Tiras.getClass element
  i = Tiras._indexOf classes, className
  return  if i is -1
  classes.splice i, 1
  Tiras.attribute element,
    class: classes.join " "
  if IS.function listener
    listener()
  return

Tiras.create = (html) ->
  div = doc.createElement "tbody"
  doc = doc.createDocumentFragment()
  Tiras.html div, html
  children = Tiras.children div
  i = 0
  j = children.length

  while i < j
    Tiras.append doc, children[i]
    i++
    doc

Tiras.copy = (element) ->
  throw new Error "#{element} is not a DOMNode object" unless IS.domNode element
  element.cloneNode true

Tiras.html = (element, string) ->
  throw new Error "#{element} is not a DOMNode object" unless IS.domNode element
  if IS.string string
    element.innerHTML = string
    return string
  element.innerHTML

Tiras.text = (element, string) ->
  throw new Error "#{element} is not a DOMNode object" unless IS.domNode element
  if IS.string string
    if element.innerText
      element.innerText = string
    else
      element.textContent = string
    return string
  return element.innerText  if element.innerText
  element.textContent

Tiras.template = (tpl, hash) ->
  regex = /\{\{.*?\}\}/g
  tpl.replace regex, replacer = (str, pos, tpl) ->
    properties = str.replace("{{", "").replace("}}", "").trim().split(" ")
    tag = properties[0]
    return ""  if not tag or not hash.hasOwnProperty tag
    return hash[tag].apply tpl, properties if IS.function hash[tag]
    return hash[tag] if IS.string hash[tag] or IS.number hash[tag]
    ""

Tiras.append = (element, html) ->
  throw new Error "#{element} is not a DOMNode object" unless IS.domNode element
  html = Tiras.create html if IS.string html
  element.appendChild html
  html

Tiras.prepend = (element, html) ->
  throw new Error "#{element} is not a DOMNode object" unless IS.domNode element
  html = Tiras.create html  if IS.string html
  element.insertBefore html, element.firstChild
  html

Tiras.after = (element, html) ->
  throw new Error "#{element} is not a DOMNode object" unless IS.domNode element
  html = Tiras.create html  if IS.string html
  element.parentNode.insertBefore html, element.nextSibling
  html

Tiras.before = (element, html) ->
  throw new Error "#{element} is not a DOMNode object" unless IS.domNode element
  html = Tiras.create html  if IS.string html
  element.insertBefore html, element
  html

Tiras.replace = (element, html) ->
  throw new Error "#{element} is not a DOMNode object" unless IS.domNode element
  html = Tiras.create html  if IS.string html
  element.parentNode.replaceChild html, element
  html

Tiras.remove = (element) ->
  throw new Error "#{element} is not a DOMNode object" unless IS.domNode element
  parent = element.parentNode
  parent.removeChild element

Tiras.data = (element, name) ->
  throw new Error "#{element} is not a DOMNode object" unless IS.domNode element
  if IS.undefined name
    if element.hasOwnProperty "dataset"
      dataset = {}
      for i of element.dataset
        dataset[i] = element.dataset[i]
      return dataset
    else
      dataset = {}
      i = 0
      attributes = element.attributes
      l = attributes.length

      while i < l
        attr = attributes.item i
        continue if attr.nodeName.substr(0, 5) isnt "data-"
        dataset[attr.nodeName.substr(5)] = attr.nodeValue
        i++
      return dataset
  return Tiras.attribute element, "data-" + name if IS.string name
  if IS.array name
    dataset = {}
    i = 0
    l = name.length

    while i < l
      prop = name[i]
      dataset[prop] = Tiras.attribute element, "data-" + prop
      i++
    return dataset
  if Tiras.isLiteralObject name
    attrs = {}
    for i of name
      attrs["data-" + i] = name[i]
    Tiras.attribute element, attrs
  return

Tiras.randomVal = (min, max)->
  Math.floor Math.random() * (max - min + 1) + min

root.Tiras = Tiras

module.exports = Tiras
