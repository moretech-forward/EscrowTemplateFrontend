import React from 'react';
import { Button } from 'pixel-retroui';

export const SubmitButton = ({ status, contract }) => (
    <div className="w-full pr-8 mt-2">
        <Button
            type="submit"
            bg="#c281b5"
            textColor="#fefccf"
            borderColor="black"
            shadow="#fefccf"
            className="py-1 w-full"
            disabled={status.loading || !contract}
        >
            {status.loading ? 'Processing...' : 'Initialize'}
        </Button>
    </div>
);