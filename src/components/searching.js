// searching.js
import { rules, compare } from "../lib/compare.js";

export function initSearching(searchField) {
    return (data, state, action) => {
        // Очистка поиска при нажатии на кнопку
        if (action?.button?.name === 'search') {
            const button = action.button;
            const input = button.parentElement?.querySelector('input');
            if (input) {
                input.value = '';
                // Очищаем состояние поиска
                state[searchField] = '';
            }
        }
        
        const searchValue = state?.[searchField] || '';
        if (!searchValue) return data;
        
        console.log('Поиск по значению:', searchValue);
        console.log('Данные до поиска:', data.length);
        
        // Создаем правило поиска по нескольким полям
        const searchRule = rules.searchMultipleFields(
            searchField,                    // ключ в целевом объекте (например, 'search')
            ['customer', 'seller', 'date'], // поля для поиска (из вашей структуры данных)
            false                           // регистронезависимый поиск
        );
        
        // Фильтруем данные
        const filteredData = data.filter(item => {
            const target = {
                [searchField]: searchValue
            };
            
            // Применяем правила сравнения
            return compare(item, target, [
                rules.skipEmptyTargetValues(), // пропускаем пустые значения
                searchRule                      // ищем по нескольким полям
            ]);
        });
        
        console.log('Данные после поиска:', filteredData.length);
        return filteredData;
    };
}