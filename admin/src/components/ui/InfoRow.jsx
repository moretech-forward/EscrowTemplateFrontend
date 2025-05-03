export default function InfoRow({label, value, loading}) {
    return (
        <p className="flex flex-wrap items-baseline gap-x-2">
            <span className="font-bold shrink-0">{label}</span>
            <span>{loading ? "Loading..." : value}</span>
        </p>
    );
}