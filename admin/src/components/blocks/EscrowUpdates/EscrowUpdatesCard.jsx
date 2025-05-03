import {Card} from 'pixel-retroui';
import AddAmount from './AddAmount.jsx';
import IncreasePeriod from './IncreasePeriod.jsx';
import ReleaseAmount from './ReleaseAmount.jsx';
import { useAppData } from '@/hooks/useAppData.jsx';

export default function EscrowUpdatesCard() {
    const { contract, signer, tokenAddress, refreshData } = useAppData();

    return (
        <Card className="p-4">
            <h2 className="text-lg sm:text-xl font-bold text-center md:text-left text-black mb-4">
                Escrow Updates
            </h2>
            <div className="flex flex-col gap-4">
                <AddAmount contract={contract} signer={signer} tokenAddress={tokenAddress} />
                <IncreasePeriod contract={contract} />
                <ReleaseAmount contract={contract} />
            </div>
        </Card>
    );
}