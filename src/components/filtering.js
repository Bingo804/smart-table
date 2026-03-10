import {createComparison, defaultRules} from "../lib/compare.js";

// @todo: #4.3 — настроить компаратор
const compare = createComparison(defaultRules); 

export function initFiltering(elements, indexes) {
    // @todo: #4.1 — заполнить выпадающие списки опциями
Object.keys(indexes)                                    // Получаем ключи из объекта
      .forEach((elementName) => {                        // Перебираем по именам
        elements[elementName].append(                    // в каждый элемент добавляем опции
            ...Object.values(indexes[elementName])        // формируем массив имён, значений опций
                      .map(name => {                        // используйте name как значение и текстовое содержимое
                        const option = document.createElement('option'); // создаем элемент
                        option.value = name;           // значение = "Иванов"
                        option.textContent = name;      // текст = "Иванов"
                        return option;                             // @todo: создать и вернуть тег опции
                      })
        )
     })
    return (data, state, action) => {
        // @todo: #4.2 — обработать очистку поля
         if (action && action.button && action.button.name === 'clear') {
        const button = action.button;
        
        // 1. Находим поле ввода (input рядом с кнопкой)
        const parent = button.parentElement; // родитель кнопки
        const input = parent.querySelector('input'); // ищем input внутри родителя
        
        if (input) {
            // 2. Сбрасываем value у input в DOM
            input.value = '';
            
            // 3. Получаем название поля из data-field
            const fieldName = button.dataset.field; // или button.getAttribute('data-field')
            
            // 4. Сбрасываем соответствующее поле в state
            if (fieldName && state.filters) {
                state.filters[fieldName] = '';
            }
        }
    }
        // @todo: #4.5 — отфильтровать данные используя компаратор
        return data.filter(row => compare(row, state)); 
    }
}