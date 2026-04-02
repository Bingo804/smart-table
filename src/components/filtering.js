export function initFiltering(elements) {
    const updateIndexes = (elements, indexes) => {
        Object.keys(indexes).forEach((elementName) => {
            elements[elementName].append(...Object.values(indexes[elementName]).map(name => {
                const el = document.createElement('option');
                el.textContent = name;
                el.value = name;
                return el;
            }))
        })
    }

    const applyFiltering = (query, state, action) => {
        // код с обработкой очистки поля
        if (action?.button?.name === 'clear') {
            const button = action.button;
            const parent = button.parentElement;
            const input = parent?.querySelector('input, select');
            
            if (input) {
                input.value = '';
                const fieldName = button.dataset.field;
                if (fieldName && state) {
                    state[fieldName] = '';
                }
            }
            // При очистке возвращаем query без изменений
            return query;
        }
        const filter = {};
        // @todo: #4.5 — отфильтровать данные, используя компаратор
    if (state.totalFrom && state.totalFrom.trim() !== '') {
        filter['filter[totalFrom]'] = parseFloat(state.totalFrom);
    }

    if (state.totalTo && state.totalTo.trim() !== '') {
        filter['filter[totalTo]'] = parseFloat(state.totalTo);
    }
     

        Object.keys(elements).forEach(key => {
            if (elements[key]) {
                if (['INPUT', 'SELECT'].includes(elements[key].tagName) && elements[key].value) { // ищем поля ввода в фильтре с непустыми данными
                    filter[`filter[${elements[key].name}]`] = elements[key].value; // чтобы сформировать в query вложенный объект фильтра
                }
            }
        })

        return Object.keys(filter).length ? Object.assign({}, query, filter) : query; // если в фильтре что-то добавилось, применим к запросу
    }

    return {
        updateIndexes,
        applyFiltering
    }
}