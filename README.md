# react-dragandselect

## Installation
> npm i react-dragandselect

or

> yarn add react-dragandselect

## Props
| Prop  | Type  | Default | Description |
|:--------- | :---- | :----   |:----  |
| `isEnable` | `boolean` | `true` | Can enable/disable drag and select |
| `style` | `style object` | `undefined` | Can change wrapper style |
| `boxStyle` | `style object` | `undefined` | Can change box style (ex: { background-color: red, border-color: orange, opacity: 1}) |
| `onSelectedItems` | `() => void` | `Must need` | Callback selected data key item |

## Usage
* **Must wrapping children item once again by ```<div><div data-select-key={uniquie key}></div></div>```**
* Drag and select find item by **`data-select-key`**
* Must set `data-select-key` what you want find selected items

```js
  import DragAndSelect from 'react-dragandselect';

  const childStyle = { width: '100%', height: '100px', marginBottom: '10px', textAlign: 'center' };
  const childItems = [{ id: '1', color: 'red'}, { id: '2', color: 'orange' }, { id: '3', color: 'yellow' }, { id: '4', color: 'green' }, { id: '5', color: 'blue' }]

  const handleSelectedItems = (selectedDataKeys) => {
    console.log("selectedDataKeys", selectedDataKeys);
  }

  <DragAndSelect onSelectedItems={handleSelectedItems}>
    {
      childItems.map((childItem) => {
        return (
          <div>
            <div data-select-key={childItem.id} style={{...childStyle, backgroundColor: childItem.color}}>
              {childItem.id}
            </div>
          </div>
        );
      })
    }
  </DragAndSelect>
```# react-dragandselect
