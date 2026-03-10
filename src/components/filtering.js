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
            return data; // Возвращаем все данные при очистке
        }
        
        // Собираем активные фильтры (только те, что не пустые)
        const activeFilters = {};
        
        // Фильтр по дате (частичное совпадение)
        if (state?.date && state.date.trim() !== '') {
            activeFilters.date = state.date.trim();
        }
        
        // Фильтр по покупателю (точное совпадение)
        if (state?.customer && state.customer.trim() !== '') {
            activeFilters.customer = state.customer.trim();
        }
        
        // Фильтр по продавцу (точное совпадение из выпадающего списка)
        if (state?.seller && state.seller.trim() !== '') {
            activeFilters.seller = state.seller.trim();
        }
        
        // Числовые фильтры (уже работают)
        if (state?.totalFrom && state.totalFrom.trim() !== '') {
            activeFilters.totalFrom = parseFloat(state.totalFrom);
        }
        
        if (state?.totalTo && state.totalTo.trim() !== '') {
            activeFilters.totalTo = parseFloat(state.totalTo);
        }
        
        // Если нет активных фильтров, возвращаем все данные
        if (Object.keys(activeFilters).length === 0) {
            return data;
        }
        
        console.log('Активные фильтры:', activeFilters);
        console.log('Данных до фильтрации:', data.length);
        
        // Фильтруем данные
        const filteredData = data.filter(item => {
            // Фильтр по дате (частичное совпадение, регистронезависимое)
            if (activeFilters.date && !item.date.includes(activeFilters.date)) {
                return false;
            }
            
            // Фильтр по покупателю (частичное совпадение, регистронезависимое)
            if (activeFilters.customer && 
                !item.customer.toLowerCase().includes(activeFilters.customer.toLowerCase())) {
                return false;
            }
            
            // Фильтр по продавцу (точное совпадение)
            if (activeFilters.seller && item.seller !== activeFilters.seller) {
                return false;
            }
            
            // Фильтр по минимальной сумме
            if (activeFilters.totalFrom !== undefined && item.total < activeFilters.totalFrom) {
                return false;
            }
            
            // Фильтр по максимальной сумме
            if (activeFilters.totalTo !== undefined && item.total > activeFilters.totalTo) {
                return false;
            }
            
            return true;
        });
        
        console.log('Данных после фильтрации:', filteredData.length);
        return filteredData;
    };
}