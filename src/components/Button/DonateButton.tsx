import React, { useEffect, useState } from 'react';
import donate from '../../assets/donate.svg';
import { amountWithCommas } from '../../utils/util';

interface DonateBtnProps {
  campaignid: string;
  className?: string;
  amount?: number | 0;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
}

function DonateButton(props: DonateBtnProps) {
  const onDonateBtnClick = (campaignid: string) => {
    const goCampaignUrl = `/campaign/${campaignid}`;
    window.location.href = goCampaignUrl;
  };
  const {
    campaignid,
    className,
    amount,
    onClick = onDonateBtnClick(campaignid),
  } = props;
  const [custAmt, setCustAmt] = useState<string>('');

  useEffect(() => {
    if (typeof amount !== 'undefined') {
      if (amount > 0) {
        setCustAmt(`$${amountWithCommas(amount)}`);
      }
    }
  }, [amount]);

  return (
    <button
      type="button"
      className={`group campaign-donate p-cust-btn px-cust-xx bg-bene-dark-blue text-white font-semibold rounded-bene-1 animation-pulse ${className}`}
      onClick={(e: React.MouseEvent<HTMLElement>) => {
        if (typeof onClick === 'function') {
          onClick(e);
        }
      }}>
      <div className="donate-button-small-inner flex justify-center">
        <img
          className="transform group-hover:scale-105 transition duration-350 ease-out mr-2"
          src={donate}
          alt="support"
        />
        Support {custAmt}
      </div>
    </button>
  );
}

export default DonateButton;