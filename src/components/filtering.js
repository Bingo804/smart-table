import { rules, compare } from "../lib/compare.js";

export function initFiltering(elements, indexes) {
    // Заполняем выпадающие списки опциями
    Object.keys(indexes).forEach((elementName) => {
        elements[elementName].append(
            ...Object.values(indexes[elementName])
                .map(name => {
                    const option = document.createElement('option');
                    option.value = name;
                    option.textContent = name;
                    return option;
                })
        );
    });
    
    return (data, state, action) => {
        // Обработка кнопки очистки
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
        }
        
        // Собираем ТОЛЬКО поля фильтрации из state
        const filterState = {
            seller: state?.seller || '',
            totalFrom: state?.totalFrom || '',
            totalTo: state?.totalTo || ''
        };
        
        // Проверяем, есть ли активные фильтры
        const hasActiveFilters = Object.values(filterState).some(v => v !== '');
        if (!hasActiveFilters) return data;
        
        console.log('Фильтруем по:', filterState);
        console.log('Данных до фильтрации:', data.length);
        
        // Фильтруем данные
        const filteredData = data.filter(item => {
            // Создаем целевой объект для сравнения
            const target = {};
            
            // Добавляем фильтр по продавцу, если есть
            if (filterState.seller) {
                target.seller = filterState.seller;
            }
            
            // Для числовых диапазонов используем специальный подход
            if (filterState.totalFrom || filterState.totalTo) {
                // Создаем массив [from, to] для правила arrayAsRange
                target.total = [
                    filterState.totalFrom ? parseFloat(filterState.totalFrom) : null,
                    filterState.totalTo ? parseFloat(filterState.totalTo) : null
                ];
            }
            
            // Если нет активных фильтров для этого элемента, пропускаем
            if (Object.keys(target).length === 0) return true;
            
            // Применяем правила сравнения
            return compare(item, target, [
                rules.skipEmptyTargetValues(),
                rules.arrayAsRange() // правило для обработки массива как диапазона
            ]);
        });
        
        console.log('Данных после фильтрации:', filteredData.length);
        return filteredData;
    };
}