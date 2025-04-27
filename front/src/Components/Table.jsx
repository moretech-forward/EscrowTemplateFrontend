import {h} from 'preact';
import {useState, useEffect} from 'preact/hooks';
import {Button} from 'pixel-retroui';

export default function Table({
                                  headers = [],
                                  rows = [],
                                  className = '',
                                  onRowClick = null,
                                  itemsPerPage = 10
                              }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [maxVisiblePages, setMaxVisiblePages] = useState(5); // Начальное значение
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768); // Состояние для отслеживания мобильного режима
    const totalPages = Math.ceil(rows.length / itemsPerPage);

    // Эффект для адаптивного изменения количества видимых страниц и состояния мобильного режима
    useEffect(() => {
        const updateLayout = () => {
            setIsMobile(window.innerWidth < 768);
            setMaxVisiblePages(window.innerWidth < 768 ? 3 : 5);
        };

        updateLayout();
        window.addEventListener('resize', updateLayout);
        return () => window.removeEventListener('resize', updateLayout);
    }, []);

    // Получаем данные для текущей страницы
    const paginatedRows = rows.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Функция для отображения номеров страниц (теперь использует maxVisiblePages)
    const renderPageNumbers = () => {
        const pageNumbers = [];
        const sidePages = Math.floor(maxVisiblePages / 2);

        // Всегда добавляем первую страницу, если она не единственная
        if (totalPages > 1) {
            pageNumbers.push(1);
        }

        // Определяем диапазон страниц вокруг текущей
        let startPage = Math.max(2, currentPage - sidePages);
        let endPage = Math.min(totalPages - 1, currentPage + sidePages);

        // Добавляем многоточие после первой страницы, если есть разрыв
        if (startPage > 2) {
            pageNumbers.push('...');
        }

        // Добавляем страницы в середине
        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }

        // Добавляем многоточие перед последней страницей, если есть разрыв
        if (endPage < totalPages - 1) {
            pageNumbers.push('...');
        }

        // Добавляем последнюю страницу, если она не первая и не единственная
        if (totalPages > 1 && (pageNumbers.length === 0 || pageNumbers[pageNumbers.length - 1] !== totalPages)) {
            pageNumbers.push(totalPages);
        }

        return pageNumbers.map((page, index) => (
            page === '...' ? (
                <span key={`ellipsis-${index}`} className="px-2">...</span>
            ) : (
                <Button
                    key={`page-${page}`}
                    onClick={() => setCurrentPage(page)}
                    style={{
                        color: currentPage === page ? 'black' : undefined,
                        borderColor: currentPage === page ? 'black' : undefined,
                    }}
                    bg={currentPage === page ? '#fefcd0' : undefined}
                    shadow={currentPage === page ? "#c381b5" : undefined}
                    className={`min-w-[40px] ${currentPage === page ? 'font-bold' : ''}`}
                >
                    {page}
                </Button>
            )
        ));
    };

    return (
        <div className={`flex flex-col ${className}`}>
            {/* Таблица (осталось без изменений) */}
            <div className="overflow-x-auto shadow-lg rounded-lg">
                <table className="table-auto w-full border-collapse text-black font-minecraft"
                       style={{
                           borderCollapse: 'separate',
                           borderSpacing: '2px',
                           backgroundColor: '#fefcd0',
                       }}>
                    <thead>
                    <tr className="text-black text-lg">
                        {headers.map((header, index) => (
                            <th key={index}
                                className="border border-black px-4 py-2 uppercase text-center"
                                style={{
                                    backgroundColor: '#dcdcdc', // Фон заголовков
                                    borderStyle: 'solid',
                                    borderWidth: '2px',
                                }}>
                                {header}
                            </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {paginatedRows.map((row, rowIndex) => (
                        <tr
                            key={rowIndex}
                            onClick={() => onRowClick && onRowClick(row)}
                            className={`hover:bg-gray-300 ${onRowClick ? 'cursor-pointer' : ''}`}
                            style={{
                                backgroundColor: rowIndex % 2 === 0 ? '#fefcd0' : '#ffffff', // Зебра-эффект
                            }}>
                            {row.map((cell, cellIndex) => (
                                <td key={cellIndex}
                                    className="border border-black px-4 py-2 text-center"
                                    style={{
                                        borderStyle: 'solid',
                                        borderWidth: '2px',
                                    }}>
                                    {cell}
                                </td>
                            ))}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Адаптивная пагинация */}
            {totalPages > 1 && (
                <div
                    className="mt-6 md:mt-4 flex flex-col items-center md:flex-row md:justify-between md:items-center md:gap-0">
                    <div></div>
                    {/* Пустой блок для балансировки */}

                    <div className="flex items-center gap-2">
                        {/* Условный рендеринг стрелок */}
                        {!isMobile && (
                            <Button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                            >
                                ←
                            </Button>
                        )}

                        {renderPageNumbers()}

                        {!isMobile && (
                            <Button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                            >
                                →
                            </Button>
                        )}
                    </div>

                    <span className="text-sm text-gray-500 py-6 md:mr-4">
                        {currentPage} / {totalPages}
                    </span>
                </div>
            )}
        </div>
    );
}