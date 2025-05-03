export const StatusMessage = ({ status }) => {
    if (!status.message) return null;

    return (
        <div className={`text-sm ${status.isError ? 'text-red-500' : 'text-green-500'} text-center`}>
            {status.message}
        </div>
    );
};