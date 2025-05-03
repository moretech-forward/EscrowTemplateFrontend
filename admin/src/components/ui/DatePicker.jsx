import { useEffect } from 'preact/hooks';
import AirDatepicker from 'air-datepicker';
import 'air-datepicker/air-datepicker.css';
import { Input } from 'pixel-retroui';

export default function DatePicker({ value, onChange, error, placeholder = 'Select date and time' }) {
    const datePickerId = `date-picker-${Math.random().toString(36).substr(2, 9)}`; // Уникальный ID для каждого инстанса

    useEffect(() => {
        // Инициализация air-datepicker
        const picker = new AirDatepicker(`#${datePickerId}`, {
            timepicker: true, // Включаем выбор времени
            dateFormat: 'yyyy-MM-dd HH:mm', // Формат даты и времени
            autoClose: true, // Автоматически закрывать после выбора
            onSelect: ({ date }) => {
                if (date) {
                    const timestamp = date.getTime(); // Получаем timestamp
                    onChange(timestamp); // Передаем timestamp в родительский компонент
                }
            },
            onShow: () => {
                // Кастомизация стилей при открытии
                document.querySelector('.air-datepicker').style.backgroundColor = '#fefcd0';
                document.querySelector('.air-datepicker').style.border = '2px solid black';
                document.querySelectorAll('.air-datepicker-cell').forEach((cell) => {
                    cell.style.color = 'black';
                    cell.style.fontFamily = 'font-minecraft'; // Используем пиксельный шрифт
                });
            },
        });

        // Очистка при размонтировании
        return () => picker.destroy();
    }, []);

    return (
        <div className="relative w-full">
            {/* Отображаемый инпут */}
            <Input
                id={datePickerId} // Привязываем ID к элементу
                type="text"
                readOnly
                placeholder={placeholder}
                borderColor={error ? '#ff0000' : 'black'}
                className="w-full"
            />
            {/* Скрытый инпут для хранения timestamp */}
            <input
                type="hidden"
                value={value || ''}
                name="timestamp"
            />
        </div>
    );
}