import type { FormKitNode } from '@formkit/core'

//Přidá do FormKit listu další item (bez zadání indexu ho přidá na konec pole)
const add = async <T>(node: FormKitNode<T[]>, newValue: T, index?: number) => {
  const value = node.value.slice()
  value.splice((typeof index === 'number' ? index : value.length) + 1, 0, newValue)
  await node.input(value, false)
}

//Oddělá z FormKit listu item z poslaného indexu
const remove = async <T>(node: FormKitNode<T[]>, index: number) => {
  const value = node.value.slice()
  value.splice(index, 1)
  await node.input(value, false)
}

const up = async <T>(node: FormKitNode<T[]>, index: number) => {
  const value = node.value.slice()
  value.splice(index - 1, 0, value.splice(index, 1)[0])
  await node.input(value, false)
}

const down = async <T>(node: FormKitNode<T[]>, index: number) => {
  const value = node.value.slice()
  value.splice(index + 1, 0, value.splice(index, 1)[0])
  await node.input(value, false)
}
export const useFormKit = () => {
  return { add, remove, up, down }
}
